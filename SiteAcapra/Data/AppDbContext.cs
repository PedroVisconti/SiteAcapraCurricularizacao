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
            modelBuilder.Entity<Vacina>(e => {
                e.ToTable("Vacina");
                e.HasKey(v => v.VacinaId).HasName("PK_Vacina");
                e.Property(v => v.VacinaId).ValueGeneratedOnAdd();
                e.Property(v => v.Nome).IsRequired();
                e.Property(v => v.Excluido).IsRequired().HasDefaultValue(false);
            });

            modelBuilder.Entity<Raca>(e => {
                e.ToTable("Raca");
                e.HasKey(r => r.RacaId).HasName("PK_Raca");
                e.Property(r => r.RacaId).ValueGeneratedOnAdd();
                e.Property(r => r.Nome).IsRequired();
                e.Property(r => r.Excluido).IsRequired().HasDefaultValue(false);
                e.HasMany(r => r.Animais).WithOne(a => a.Raca).HasForeignKey(a => a.RacaId).HasConstraintName("FK_Animal_Raca").OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Especie>(e => {
                e.ToTable("Especie");
                e.HasKey(es => es.EspecieId).HasName("PK_Especie");
                e.Property(es => es.EspecieId).ValueGeneratedOnAdd();
                e.Property(es => es.Nome).IsRequired();
                e.Property(es => es.Excluido).IsRequired().HasDefaultValue(false);
                e.HasMany(es => es.Animais).WithOne(es => es.Especie).HasForeignKey(es => es.EspecieId).HasConstraintName("FK_Animal_Especie").OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Usuario>(e =>
            {
                e.ToTable("Usuario");
                e.HasKey(u => u.UsuarioId).HasName("PK_Usuario");
                e.Property(u => u.UsuarioId).ValueGeneratedOnAdd();
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
                e.HasOne(u => u.TipoUsuario).WithMany(tu => tu.Usuario).HasForeignKey(u => u.TipoUsuarioId).HasConstraintName("FK_Usuario_TipoUsuario").OnDelete(DeleteBehavior.Restrict); ;
            });

            modelBuilder.Entity<Animal>(e =>
            {
                e.ToTable("Animal");
                e.HasKey(a => a.AnimalId).HasName("PK_Animal");
                e.Property(a => a.AnimalId).ValueGeneratedOnAdd();
                e.Property(a => a.Nome).HasMaxLength(200).IsRequired();
                e.Property(a => a.DataNascimento).HasColumnType("date").IsRequired();
                e.Property(a => a.Peso).HasColumnType("decimal(10,2)").IsRequired();
                e.Property(a => a.DescricaoSaude);
                e.Property(a => a.NecessidadesEspeciais);
                e.Property(a => a.Adotado).IsRequired();
                e.Property(a => a.DataAdocao).HasColumnType("datetime");
                e.Property(a => a.Excluido).IsRequired().HasDefaultValue(false);
                e.Property(a => a.Descricao);
                e.Property(a => a.DataCadastro).HasColumnType("datetime").IsRequired();
                e.Property(a => a.Castrado).IsRequired();
                e.Property(a => a.RacaId).IsRequired();
                e.HasOne(a => a.Raca).WithMany(r => r.Animais).HasForeignKey(a => a.RacaId).HasConstraintName("FK_Animal_Raca").OnDelete(DeleteBehavior.Restrict);
                e.Property(a => a.EspecieId).IsRequired();
                e.HasOne(a => a.Especie).WithMany(e => e.Animais).HasForeignKey(a => a.EspecieId).HasConstraintName("FK_Animal_Especie").OnDelete(DeleteBehavior.Restrict);
                e.Property(a => a.TutorId).IsRequired();
                e.HasOne(a => a.Tutor).WithMany(t => t.Animals).HasForeignKey(a => a.TutorId).HasConstraintName("FK_Animal_Tutor").OnDelete(DeleteBehavior.Restrict);
                e.HasMany(a => a.Fotos).WithOne(f => f.Animal).HasForeignKey(f => f.AnimalId).HasConstraintName("FK_Foto_Animal").OnDelete(DeleteBehavior.Cascade);
                e.HasMany(a => a.FormulariosAdocao).WithOne(f => f.Animal).HasForeignKey(f => f.AnimalId).HasConstraintName("FK_Formulario_Animal").OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AnimalVacina>(e => 
            {
                e.ToTable("AnimalVacina");
                e.HasKey(av => new { av.AnimalId, av.VacinaId });
                e.HasOne(av => av.Animal).WithMany(a => a.AnimalVacinas).HasForeignKey(av => av.AnimalId).HasConstraintName("FK_AnimalVacina_Animal").OnDelete(DeleteBehavior.Cascade);
                e.HasOne(av => av.Vacina).WithMany(v => v.AnimalVacinas).HasForeignKey(av => av.VacinaId).HasConstraintName("FK_AnimalVacina_Vacina").OnDelete(DeleteBehavior.Cascade);
                e.Property(av => av.DataVacina).HasColumnType("datetime").IsRequired();
            });
        }
    }
}
