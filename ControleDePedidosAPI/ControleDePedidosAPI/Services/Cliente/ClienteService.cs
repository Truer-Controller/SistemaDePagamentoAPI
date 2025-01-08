using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDePedidosAPI.Context;
using ControleDePedidosAPI.Dto.Cliente;
using ControleDePedidosAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleDePedidosAPI.Services.Cliente
{
    public class ClienteService : IClienteService
    {
        private readonly AppDbContext _context;

        public ClienteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel<List<ClienteModel>>> CreateClienteAsync(CreateClienteDto createClienteDto)
        {
            var resposta = new ResponseModel<List<ClienteModel>>();

            try
            {
                var cliente = new ClienteModel()
                {
                    Nome = createClienteDto.Nome,
                    Email = createClienteDto.Email
                };

                _context.Add(cliente);
                await _context.SaveChangesAsync();

                resposta.Dados = await _context.Clientes.ToListAsync();
                resposta.Mensagem = "Cliente criado com sucesso";
                resposta.Status = true;

                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = $"Erro ao criar o cliente: {ex.Message}";
                resposta.Status = false;
                return resposta;
            }
        }

        public async Task<ResponseModel<List<ClienteModel>>> GetClientesAsync()
        {
            var resposta = new ResponseModel<List<ClienteModel>>();

            try
            {
                resposta.Dados = await _context.Clientes.ToListAsync();
                resposta.Mensagem = "Clientes localizados";
            }
            catch (Exception ex)
            {
                resposta.Mensagem = ex.Message;
                resposta.Status = false;
            }

            return resposta;
        }
    }
}
