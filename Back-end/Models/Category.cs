using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back_end.Models;

public class Category
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(400)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Purpose Purpose { get; set; }

    // Propriedade de navegação
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}