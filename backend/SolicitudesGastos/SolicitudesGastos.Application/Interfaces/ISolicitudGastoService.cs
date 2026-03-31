using SolicitudesGastos.Domain.Entities;
using SolicitudesGastos.Domain.ValueObjects;

namespace SolicitudesGastos.Application.Interfaces;

public interface ISolicitudGastoService
{
    Task<List<SolicitudGasto>> GetAllAsync();
    Task<SolicitudGasto?> GetByIdAsync(int id);

    Task CrearAsync(SolicitudGasto solicitud);

    Task EditarAsync(int id, string categoria, string descripcion, ValorGasto valor, FechaGasto fechaGasto);

    Task AprobarAsync(int id);
    Task RechazarAsync(int id);
}