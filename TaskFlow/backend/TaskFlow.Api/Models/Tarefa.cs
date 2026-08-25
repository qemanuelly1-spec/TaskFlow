using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.Models;

public class Tarefa
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public bool Concluida { get; set; } = false;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}
