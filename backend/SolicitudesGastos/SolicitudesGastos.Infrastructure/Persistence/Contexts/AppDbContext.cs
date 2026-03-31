using Microsoft.EntityFrameworkCore;
using SolicitudesGastos.Domain.Entities;

namespace SolicitudesGastos.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SolicitudGasto> Solicitudes => Set<SolicitudGasto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SolicitudGasto>(entity =>
        {
            entity.ToTable("SolicitudesGastos");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Categoria)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Descripcion)
                .HasMaxLength(500);

            entity.Property(x => x.Usuario)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(x => x.Estado)
                .IsRequired();

            //  VALUE OBJECT: ValorGasto
            entity.OwnsOne(x => x.Valor, v =>
            {
                v.Property(p => p.Value)
                    .HasColumnName("Valor")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();
            });

            //  VALUE OBJECT: FechaGasto
            entity.OwnsOne(x => x.FechaGasto, f =>
            {
                f.Property(p => p.Value)
                    .HasColumnName("FechaGasto")
                    .IsRequired();
            });
        });
    }
}