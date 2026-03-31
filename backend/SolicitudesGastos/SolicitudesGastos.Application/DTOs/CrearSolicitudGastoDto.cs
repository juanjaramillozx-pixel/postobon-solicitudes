namespace SolicitudesGastos.Application.DTOs;

public class CrearSolicitudGastoDto
{
    public string Categoria { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public DateTime FechaGasto { get; set; }
    public string Usuario { get; set; } = string.Empty;
}