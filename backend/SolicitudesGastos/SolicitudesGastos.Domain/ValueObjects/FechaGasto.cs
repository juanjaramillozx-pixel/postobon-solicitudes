namespace SolicitudesGastos.Domain.ValueObjects;

public record FechaGasto
{
    public DateTime Value { get; }

    public FechaGasto(DateTime value)
    {
        if (value > DateTime.UtcNow)
            throw new ArgumentException("La fecha no puede ser futura");

        Value = value;
    }
}