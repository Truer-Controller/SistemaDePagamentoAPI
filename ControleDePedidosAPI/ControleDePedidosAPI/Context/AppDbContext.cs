using System;
using System.Threading.Tasks;
using ControleDePedidosAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDePedidosAPI.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        public DbSet<ClienteModel> Clientes { get; set; }
        public DbSet<PagamentoModel> Pagamentos { get; set; }


        //Caso não tenha dados ele irá incluir.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClienteModel>().HasData(

                new ClienteModel
                {
                    Id = 1,
                    Nome = "Juliano Ferreira",
                    Email = "juliano.ferreira@alumisoft.com.br"
                },

                new ClienteModel
                {
                    Id = 2,
                    Nome = "Ivan",
                    Email = "Ivan@alumisoft.com.br"
                }
            );
        }
    }
}
