using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.Models;

public enum Prioridade // Corrigido de Propriedade para Prioridade
{
    Baixa = 0,
    Media = 1,
    Alta = 2
}

public class Tarefa
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public bool Concluida { get; set; } = false;

    // Corrigido para usar o tipo Prioridade
    public Prioridade Prioridade { get; set; } = Prioridade.Media;
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}