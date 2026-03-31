using SolicitudesGastos.Application.Interfaces;
using SolicitudesGastos.Domain.Entities;
using SolicitudesGastos.Domain.ValueObjects;

namespace SolicitudesGastos.Application.Services;

public class SolicitudGastoService : ISolicitudGastoService
{
    private readonly ISolicitudGastoRepository _repository;

    public SolicitudGastoService(ISolicitudGastoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<SolicitudGasto>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<SolicitudGasto?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task CrearAsync(SolicitudGasto solicitud)
    {
        await _repository.AddAsync(solicitud);
        await _repository.SaveChangesAsync();
    }

    public async Task EditarAsync(
       int id,
       string categoria,
       string descripcion,
       ValorGasto valor,
       FechaGasto fechaGasto)
    {
        var solicitud = await _repository.GetByIdAsync(id);

        if (solicitud == null)
            throw new Exception("Solicitud no encontrada");

        solicitud.Editar(categoria, descripcion, valor, fechaGasto);

        await _repository.UpdateAsync(solicitud);
    }

    public async Task AprobarAsync(int id)
    {
        var solicitud = await _repository.GetByIdAsync(id);

        if (solicitud == null)
            throw new Exception("Solicitud no encontrada");

        solicitud.Aprobar();

        await _repository.UpdateAsync(solicitud);
        await _repository.SaveChangesAsync();
    }

    public async Task RechazarAsync(int id)
    {
        var solicitud = await _repository.GetByIdAsync(id);

        if (solicitud == null)
            throw new Exception("Solicitud no encontrada");

        solicitud.Rechazar();

        await _repository.UpdateAsync(solicitud);
        await _repository.SaveChangesAsync();
    }
}