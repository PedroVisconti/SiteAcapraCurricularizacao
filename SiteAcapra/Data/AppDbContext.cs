using Microsoft.EntityFrameworkCore;
using SiteAcapra.Models;
using BCrypt.Net;

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
                e.HasOne(u => u.TipoUsuario).WithMany(tu => tu.Usuario).HasForeignKey(u => u.TipoUsuarioId).HasConstraintName("FK_Usuario_TipoUsuario").OnDelete(DeleteBehavior.Restrict);
                e.HasIndex(u => u.Email).IsUnique();
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
                e.Property(a => a.TutorId).IsRequired(false);
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

            modelBuilder.Entity<Tutor>(e =>
            {
                e.ToTable("Tutor");
                e.HasKey(t => t.TutorId).HasName("PK_Tutor");
                e.Property(t => t.TutorId).ValueGeneratedOnAdd();
                e.Property(t => t.Nome).IsRequired().HasMaxLength(200);
                e.Property(t => t.Email).IsRequired().HasMaxLength(100);
                e.Property(t => t.Telefone).IsRequired().HasMaxLength(15);
                e.Property(t => t.Endereco).IsRequired().HasMaxLength(100);
                e.Property(t => t.Cpf).IsRequired().HasMaxLength(11).IsFixedLength();
                e.Property(t => t.DataCadastro).HasColumnType("datetime").IsRequired();
                e.Property(t => t.DataNascimento).HasColumnType("date").IsRequired();
                e.Property(t => t.Sexo).HasColumnType("char(1)");
                e.Property(t => t.Excluido).IsRequired().HasDefaultValue(false);
            });

            modelBuilder.Entity<Foto>(e =>
            {
                e.ToTable("Foto");
                e.HasKey(f => f.FotoId).HasName("PK_Foto");
                e.Property(f => f.FotoId).ValueGeneratedOnAdd();
                e.Property(f => f.FotoHash).IsRequired();
                e.Property(f => f.Excluido).IsRequired().HasDefaultValue(false);
                e.Property(f => f.AnimalId).IsRequired();
                e.HasOne(f => f.Animal).WithMany(a => a.Fotos).HasForeignKey(f => f.AnimalId).HasConstraintName("FK_Foto_Animal").OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TipoUsuario>(e =>
            {
                e.ToTable("TipoUsuario");
                e.HasKey(tu => tu.TipoUsuarioId).HasName("PK_TipoUsuario");
                e.Property(tu => tu.TipoUsuarioId).ValueGeneratedOnAdd();
                e.Property(tu => tu.Nome).IsRequired().HasMaxLength(100);
                e.Property(tu => tu.Excluido).IsRequired().HasDefaultValue(false);
                e.HasMany(tu => tu.Usuario).WithOne(u => u.TipoUsuario).HasForeignKey(u => u.TipoUsuarioId).HasConstraintName("FK_Usuario_TipoUsuario").OnDelete(DeleteBehavior.Restrict);
            });
            
            modelBuilder.Entity<FormularioAdocao>(e =>
            {
                e.ToTable("FormularioAdocao");
                e.HasKey(fa => fa.FormularioAdocaoId).HasName("PK_FormularioAdocao");
                e.Property(fa => fa.FormularioAdocaoId).ValueGeneratedOnAdd();
                e.Property(fa => fa.DataPreenchimento)
                    .HasConversion(
                        v => v.ToDateTime(TimeOnly.MinValue),
                        v => DateOnly.FromDateTime(v)
                    )
                    .HasColumnType("datetime").IsRequired();
                e.Property(fa => fa.Resposta).IsRequired();
                e.Property(fa => fa.Excluido).IsRequired().HasDefaultValue(false);
                e.Property(fa => fa.UsuarioId).IsRequired();
                e.HasOne(fa => fa.Usuario).WithMany(u => u.Formularios).HasForeignKey(fa => fa.UsuarioId).HasConstraintName("FK_Formulario_Usuario").OnDelete(DeleteBehavior.Restrict);
                e.Property(fa => fa.AnimalId).IsRequired();
                e.HasOne(fa => fa.Animal).WithMany(a => a.FormulariosAdocao).HasForeignKey(fa => fa.AnimalId).HasConstraintName("FK_Formulario_Animal").OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TipoUsuario>().HasData(

                new TipoUsuario
                {
                    TipoUsuarioId = 1,
                    Nome = "Administrador",
                    Excluido = false,
                },
                new TipoUsuario
                {
                    TipoUsuarioId = 2,
                    Nome = "Adotante",
                    Excluido = false,
                }
            );

            modelBuilder.Entity<Usuario>().HasData(

                new Usuario
                {
                    UsuarioId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Nome = "Administrador",
                    Email = "adm@acapra.com",
                    Senha = "$2a$11$5U1NDLDWuSfVKTQRIgereuQ81YCMjhimZ2qpYM0WMcdjgkY7hEhwi",
                    Cpf = "00000000000",
                    Telefone = "00000000000",
                    Endereco = "Endereço do Administrador",
                    DataNascimento = new DateOnly(2000, 1, 1),
                    Sexo = 'M',
                    TipoUsuarioId = 1,
                }
            );
        }
    }
}
