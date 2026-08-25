using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.DTOs;

// Usado para criar uma nova tarefa (POST)
public class TarefaCreateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public bool Concluida { get; set; } = false;
}

// Usado para atualizar uma tarefa existente (PUT)
public class TarefaUpdateDto
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public bool Concluida { get; set; } = false;
}
