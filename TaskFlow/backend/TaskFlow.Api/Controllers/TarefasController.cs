using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/tarefas")]
public class TarefasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TarefasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tarefas
    // GET: api/tarefas?concluida=true
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas([FromQuery] bool? concluida)
    {
        var query = _context.Tarefas.AsQueryable();

        if (concluida.HasValue)
        {
            query = query.Where(t => t.Concluida == concluida.Value);
        }

        var tarefas = await query.OrderByDescending(t => t.DataCriacao).ToListAsync();
        return Ok(tarefas);
    }

    // GET: api/tarefas/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Tarefa>> GetTarefa(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);

        if (tarefa == null)
        {
            return NotFound(new { mensagem = $"Tarefa com id {id} não encontrada." });
        }

        return Ok(tarefa);
    }

    // POST: api/tarefas
    [HttpPost]
    public async Task<ActionResult<Tarefa>> CreateTarefa(TarefaCreateDto dto)
    {
        var tarefa = new Tarefa
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Concluida = dto.Concluida,
            DataCriacao = DateTime.UtcNow
        };

        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
    }

    // PUT: api/tarefas/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTarefa(int id, TarefaUpdateDto dto)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);

        if (tarefa == null)
        {
            return NotFound(new { mensagem = $"Tarefa com id {id} não encontrada." });
        }

        tarefa.Titulo = dto.Titulo;
        tarefa.Descricao = dto.Descricao;
        tarefa.Concluida = dto.Concluida;

        await _context.SaveChangesAsync();

        return Ok(tarefa);
    }

    // PATCH: api/tarefas/5/concluir
    [HttpPatch("{id:int}/concluir")]
    public async Task<IActionResult> MarcarComoConcluida(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);

        if (tarefa == null)
        {
            return NotFound(new { mensagem = $"Tarefa com id {id} não encontrada." });
        }

        tarefa.Concluida = !tarefa.Concluida;
        await _context.SaveChangesAsync();

        return Ok(tarefa);
    }

    // DELETE: api/tarefas/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTarefa(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);

        if (tarefa == null)
        {
            return NotFound(new { mensagem = $"Tarefa com id {id} não encontrada." });
        }

        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
