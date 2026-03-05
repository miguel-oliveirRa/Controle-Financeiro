using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back_end.Models;

public class Person
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(0, 150, ErrorMessage = "Idade deve estar entre 0 e 150")]
    public int Age { get; set; }

    // Propriedade de navegação
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}