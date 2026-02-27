using Back_end;
using Back_end.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back_end.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("totals-by-person")]
    public async Task<ActionResult<object>> GetTotalsByPerson()
    {
        var persons = await _context.Persons
            .AsNoTracking()
            .Include(p => p.Transactions)
            .ToListAsync();

        var result = persons.Select(p => new
        {
            Id = p.Id,
            Name = p.Name,
            Age = p.Age,
            TotalIncome = p.Transactions.Where(t => t.Type == TransactionType.Receita).Sum(t => t.Value),
            TotalExpenses = p.Transactions.Where(t => t.Type == TransactionType.Despesa).Sum(t => t.Value),
            Balance = p.Transactions.Where(t => t.Type == TransactionType.Receita).Sum(t => t.Value)
                      - p.Transactions.Where(t => t.Type == TransactionType.Despesa).Sum(t => t.Value)
        }).ToList();

        var overall = new
        {
            TotalIncome = result.Sum(r => r.TotalIncome),
            TotalExpenses = result.Sum(r => r.TotalExpenses),
            Balance = result.Sum(r => r.Balance)
        };

        return new { Persons = result, Overall = overall };
    }

    [HttpGet("totals-by-category")]
    public async Task<ActionResult<object>> GetTotalsByCategory()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .Include(c => c.Transactions)
            .ToListAsync();

        var result = categories.Select(c => new
        {
            Id = c.Id,
            Description = c.Description,
            Purpose = c.Purpose,
            TotalIncome = c.Transactions.Where(t => t.Type == TransactionType.Receita).Sum(t => t.Value),
            TotalExpenses = c.Transactions.Where(t => t.Type == TransactionType.Despesa).Sum(t => t.Value),
            Balance = c.Transactions.Where(t => t.Type == TransactionType.Receita).Sum(t => t.Value)
                      - c.Transactions.Where(t => t.Type == TransactionType.Despesa).Sum(t => t.Value)
        }).ToList();

        var overall = new
        {
            TotalIncome = result.Sum(r => r.TotalIncome),
            TotalExpenses = result.Sum(r => r.TotalExpenses),
            Balance = result.Sum(r => r.Balance)
        };

        return new { Categories = result, Overall = overall };
    }
}