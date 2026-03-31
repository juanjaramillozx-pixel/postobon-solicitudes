namespace SolicitudesGastos.Domain.ValueObjects;

public record ValorGasto
{
    public decimal Value { get; }

    public ValorGasto(decimal value)
    {
        if (value <= 0)
            throw new ArgumentException("El valor debe ser mayor que cero");

        Value = value;
    }

    public static implicit operator decimal(ValorGasto v) => v.Value;
}