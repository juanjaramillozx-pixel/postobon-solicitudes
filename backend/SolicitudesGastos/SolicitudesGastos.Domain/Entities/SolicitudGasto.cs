using SolicitudesGastos.Domain.Enums;
using SolicitudesGastos.Domain.ValueObjects;

namespace SolicitudesGastos.Domain.Entities;

public class SolicitudGasto
{
    public int Id { get; private set; }

    public string Categoria { get; private set; } = string.Empty;
    public string Descripcion { get; private set; } = string.Empty;

    public ValorGasto Valor { get; private set; }
    public FechaGasto FechaGasto { get; private set; }

    public string Usuario { get; private set; } = string.Empty;

    public EstadoSolicitud Estado { get; private set; }

    public DateTime? FechaDecision { get; private set; }

    // Constructor SOLO para EF (no público)
    private SolicitudGasto() { }

    // Factory method (única forma de crear)
    public static SolicitudGasto Crear(
        string categoria,
        string descripcion,
        ValorGasto valor,
        FechaGasto fechaGasto,
        string usuario)
    {
        if (string.IsNullOrWhiteSpace(categoria))
            throw new ArgumentException("La categoría es obligatoria", nameof(categoria));

        if (valor is null)
            throw new ArgumentNullException(nameof(valor));

        if (fechaGasto is null)
            throw new ArgumentNullException(nameof(fechaGasto));

        if (string.IsNullOrWhiteSpace(usuario))
            throw new ArgumentException("El usuario es obligatorio", nameof(usuario));

        return new SolicitudGasto
        {
            Categoria = categoria,
            Descripcion = descripcion,
            Valor = valor,
            FechaGasto = fechaGasto,
            Usuario = usuario,
            Estado = EstadoSolicitud.Pendiente
        };
    }

    public void Aprobar()
    {
        if (Estado != EstadoSolicitud.Pendiente)
            throw new InvalidOperationException("Solo pendientes");

        Estado = EstadoSolicitud.Aprobada;
        FechaDecision = DateTime.UtcNow;
    }

    public void Rechazar()
    {
        if (Estado != EstadoSolicitud.Pendiente)
            throw new InvalidOperationException("Solo pendientes");

        Estado = EstadoSolicitud.Rechazada;
        FechaDecision = DateTime.UtcNow;
    }

    public void Editar(
        string categoria,
        string descripcion,
        ValorGasto valor,
        FechaGasto fechaGasto)
    {
        if (Estado != EstadoSolicitud.Pendiente)
            throw new InvalidOperationException("Solo se pueden editar solicitudes pendientes");

        if (string.IsNullOrWhiteSpace(categoria))
            throw new ArgumentException("La categoría es obligatoria", nameof(categoria));

        Categoria = categoria;
        Descripcion = descripcion;
        Valor = valor;
        FechaGasto = fechaGasto;
    }
}