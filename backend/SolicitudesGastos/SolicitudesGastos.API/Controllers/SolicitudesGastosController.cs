using Microsoft.AspNetCore.Mvc;
using SolicitudesGastos.Application.Common;
using SolicitudesGastos.Application.DTOs;
using SolicitudesGastos.Application.Interfaces;
using SolicitudesGastos.Domain.Entities;
using SolicitudesGastos.Domain.ValueObjects;

namespace SolicitudesGastos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SolicitudesGastosController : ControllerBase
{
    private readonly ISolicitudGastoService _service;

    public SolicitudesGastosController(ISolicitudGastoService service)
    {
        _service = service;
    }

    // 🔹 GET ALL
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _service.GetAllAsync();

        return Ok(
            ApiResponse<List<SolicitudGasto>>.Ok(data)
        );
    }

    // 🔹 GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var data = await _service.GetByIdAsync(id);

        if (data == null)
            return NotFound(
                ApiResponse<string>.Fail("No encontrado")
            );

        return Ok(
            ApiResponse<SolicitudGasto>.Ok(data)
        );
    }

    // 🔹 CREATE
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearSolicitudGastoDto dto)
    {
        var valor = new ValorGasto(dto.Valor);
        var fechaGasto = new FechaGasto(dto.FechaGasto);

        var entity = SolicitudGasto.Crear(
            dto.Categoria,
            dto.Descripcion,
            valor,
            fechaGasto,
            dto.Usuario
        );

        await _service.CrearAsync(entity);

        return CreatedAtAction(
            nameof(GetById),
            new { id = entity.Id },
            ApiResponse<SolicitudGasto>.Ok(entity, "Creado correctamente")
        );
    }

    // 🔹 UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CrearSolicitudGastoDto dto)
    {
        var valor = new ValorGasto(dto.Valor);
        var fechaGasto = new FechaGasto(dto.FechaGasto);
        await _service.EditarAsync(
            id,
            dto.Categoria,
            dto.Descripcion,
            valor,
            fechaGasto
        );

        return Ok(
            ApiResponse<string>.Ok(null!, "Actualizado correctamente")
        );
    }

    // 🔹 APROBAR
    [HttpPost("{id}/aprobar")]
    public async Task<IActionResult> Aprobar(int id)
    {
        await _service.AprobarAsync(id);

        return Ok(
            ApiResponse<string>.Ok(null!, "Solicitud aprobada")
        );
    }

    // 🔹 RECHAZAR
    [HttpPost("{id}/rechazar")]
    public async Task<IActionResult> Rechazar(int id)
    {
        await _service.RechazarAsync(id);

        return Ok(
            ApiResponse<string>.Ok(null!, "Solicitud rechazada")
        );
    }
}