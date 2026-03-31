using Moq;
using SolicitudesGastos.Application.Interfaces;
using SolicitudesGastos.Application.Services;
using SolicitudesGastos.Domain.Entities;
using SolicitudesGastos.Domain.Enums;
using SolicitudesGastos.Domain.ValueObjects;
using Xunit;

namespace SolicitudesGastos.Tests.Application.Services;

public class SolicitudGastoServiceTests
{
    private readonly Mock<ISolicitudGastoRepository> _repositoryMock;
    private readonly SolicitudGastoService _service;

    public SolicitudGastoServiceTests()
    {
        _repositoryMock = new Mock<ISolicitudGastoRepository>();
        _service = new SolicitudGastoService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CrearSolicitud_DeberiaGuardarCorrectamente()
    {
        // Arrange
        var solicitud = CrearSolicitudPendiente();

        // Act
        await _service.CrearAsync(solicitud);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(solicitud), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task AprobarSolicitud_DeberiaCambiarEstado_AAprobada()
    {
        // Arrange
        var solicitud = CrearSolicitudPendiente();

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(solicitud);

        // Act
        await _service.AprobarAsync(1);

        // Assert
        Assert.Equal(EstadoSolicitud.Aprobada, solicitud.Estado);
        Assert.NotNull(solicitud.FechaDecision);

        _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(solicitud), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task RechazarSolicitud_DeberiaCambiarEstado_ARechazada()
    {
        // Arrange
        var solicitud = CrearSolicitudPendiente();

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(solicitud);

        // Act
        await _service.RechazarAsync(1);

        // Assert
        Assert.Equal(EstadoSolicitud.Rechazada, solicitud.Estado);
        Assert.NotNull(solicitud.FechaDecision);

        _repositoryMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        _repositoryMock.Verify(r => r.UpdateAsync(solicitud), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task AprobarSolicitud_NoDeberiaPermitir_AprobarSiYaEstaAprobada()
    {
        // Arrange
        var solicitud = CrearSolicitudPendiente();
        solicitud.Aprobar();

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(solicitud);

        // Act
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AprobarAsync(1));

        // Assert
        Assert.Equal("Solo pendientes", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<SolicitudGasto>()), Times.Never);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task AprobarSolicitud_NoDeberiaPermitir_AprobarSiYaEstaRechazada()
    {
        // Arrange
        var solicitud = CrearSolicitudPendiente();
        solicitud.Rechazar();

        _repositoryMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(solicitud);

        // Act
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AprobarAsync(1));

        // Assert
        Assert.Equal("Solo pendientes", exception.Message);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<SolicitudGasto>()), Times.Never);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    private static SolicitudGasto CrearSolicitudPendiente()
    {
        return SolicitudGasto.Crear(
            "Viaje",
            "Taxi aeropuerto",
            new ValorGasto(50000),
            new FechaGasto(DateTime.UtcNow.AddDays(-1)),
            "juan.perez");
    }
}