using Back_end;
using Back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back_end.Controllers;

/// Controller de Transações - gerencia movimentações financeiras com validações de negócio

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        return await _context.Transactions
            .AsNoTracking()
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
        {
            return NotFound();
        }

        return transaction;
    }

    /// <summary>
    /// POST: api/Transactions - Cria nova transação com validações de negócio:
    /// 1. Pessoa deve existir
    /// 2. Menores de 18 anos só podem ter despesas
    /// 3. Categoria deve existir e ter propósito compatível com o tipo da transação
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validar se a pessoa existe
        var person = await _context.Persons.FindAsync(transaction.PersonId);
        if (person == null)
        {
            return BadRequest("Pessoa não encontrada.");
        }

        // Regra de negócio: menores de 18 anos só podem ter despesas
        if (person.Age < 18 && transaction.Type != TransactionType.Despesa)
        {
            return BadRequest("Menores podem ter apenas transações de despesa.");
        }

        // Validar se a categoria existe e o propósito corresponde
        var category = await _context.Categories.FindAsync(transaction.CategoryId);
        if (category == null)
        {
            return BadRequest("Category not found.");
        }

        // Valida compatibilidade: categoria deve aceitar o tipo da transação
        if (!IsValidCategoryForTransaction(category.Purpose, transaction.Type))
        {
            return BadRequest("Category purpose does not match transaction type.");
        }

        _context.Transactions.Add(transaction);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao salvar: {ex.Message}");
        }

        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
    }

    /// <summary>
    /// Valida se a categoria aceita o tipo de transação
    /// </summary>
    private bool IsValidCategoryForTransaction(Purpose purpose, TransactionType type)
    {
        return purpose == Purpose.Ambas ||
               (purpose == Purpose.Despesa && type == TransactionType.Despesa) ||
               (purpose == Purpose.Receita && type == TransactionType.Receita);
    }
}
