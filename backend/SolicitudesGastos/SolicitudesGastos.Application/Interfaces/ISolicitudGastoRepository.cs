using SolicitudesGastos.Domain.Entities;

namespace SolicitudesGastos.Application.Interfaces;

public interface ISolicitudGastoRepository
{
    Task<List<SolicitudGasto>> GetAllAsync();

    Task<SolicitudGasto?> GetByIdAsync(int id);

    Task AddAsync(SolicitudGasto solicitud);

    Task UpdateAsync(SolicitudGasto solicitud);

    Task DeleteAsync(int id);

    Task SaveChangesAsync();
}