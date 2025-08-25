using Microsoft.EntityFrameworkCore;
using SiteAcapra.Models;

namespace SiteAcapra.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<TipoUsuario> TipoUsuarios => Set<TipoUsuario>();
        public DbSet<Animal> Animais => Set<Animal>();
        public DbSet<Raca> Racas => Set<Raca>();
        public DbSet<Especie> Especies => Set<Especie>();
        public DbSet<Tutor> Tutores => Set<Tutor>();
        public DbSet<Foto> Fotos => Set<Foto>();
        public DbSet<Vacina> Vacinas => Set<Vacina>();
        public DbSet<AnimalVacina> AnimalVacinas => Set<AnimalVacina>();
        public DbSet<FormularioAdocao> FormularioAdocoes => Set<FormularioAdocao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>(e =>
            {
                e.ToTable("Usuario");
                e.HasKey(u => u.UsuarioId).HasName("PK_Usuario");
                e.Property(u => u.UsuarioId).IsRequired();
                e.Property(u => u.Nome).IsRequired().HasMaxLength(200);
                e.Property(u => u.Email).IsRequired().HasMaxLength(100);
                e.Property(u => u.Senha).IsRequired();
                e.Property(u => u.Cpf).IsRequired().HasMaxLength(11).IsFixedLength();
                e.Property(u => u.Telefone).IsRequired().HasMaxLength(15);
                e.Property(u => u.Endereco).IsRequired().HasMaxLength(100);
                e.Property(u => u.DataNascimento).IsRequired().HasColumnType("date");
                e.Property(u => u.Sexo).IsRequired().HasColumnType("char(1)");
                e.Property(u => u.Excluido).IsRequired().HasDefaultValue(false);
                e.Property(u => u.TipoUsuarioId).IsRequired();
                e.HasOne(u => u.TipoUsuario).
                    WithMany(tu => tu.Usuario)
                    .HasForeignKey(u => u.TipoUsuarioId).HasConstraintName("FK_Usuario_TipoUsuario")
                    .HasConstraintName("FK_Usuario_TipoUsuario");
            });

        }
    }
}
