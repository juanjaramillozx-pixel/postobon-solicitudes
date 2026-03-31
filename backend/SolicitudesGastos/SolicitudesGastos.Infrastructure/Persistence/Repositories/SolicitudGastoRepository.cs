
using Microsoft.EntityFrameworkCore;
using SolicitudesGastos.Application.Interfaces;
using SolicitudesGastos.Domain.Entities;

namespace SolicitudesGastos.Infrastructure.Persistence;

public class SolicitudGastoRepository : ISolicitudGastoRepository
{
    private readonly AppDbContext _context;

    public SolicitudGastoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SolicitudGasto>> GetAllAsync()
    {
        return await _context.Solicitudes.ToListAsync();
    }

    public async Task<SolicitudGasto?> GetByIdAsync(int id)
    {
        return await _context.Solicitudes
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task AddAsync(SolicitudGasto solicitud)
    {
        await _context.Solicitudes.AddAsync(solicitud);
    }

    public async Task UpdateAsync(SolicitudGasto solicitud)
    {
        _context.Solicitudes.Update(solicitud);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.Solicitudes.FindAsync(id);
        if (entity != null)
        {
            _context.Solicitudes.Remove(entity);
        }
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}