using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using ControleDePedidosAPI.Context;
using ControleDePedidosAPI.Models;
using System.Linq;
using ControleDePedidosAPI.Dto.Pagamento;
using Microsoft.EntityFrameworkCore;

namespace ControleDePedidosAPI.Services.Pagamento
{
    public class PagamentoService : IPagamentoService
    {
        private readonly AppDbContext _context;

        public PagamentoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseModel<List<PagamentoModel>>> GetPagamentosPorClienteAsync(int idCliente)
        {
            var resposta = new ResponseModel<List<PagamentoModel>>();

            try
            {
                var pagamentos = await _context.Pagamentos
                    .Include(p => p.Cliente)
                    .Where(p => p.Cliente.Id == idCliente)
                    .ToListAsync();

                if (!pagamentos.Any())
                {
                    resposta.Mensagem = "Nenhum pagamento encontrado para o cliente especificado.";
                    return resposta;
                }

                resposta.Dados = pagamentos;
                resposta.Mensagem = "Pagamentos encontrados com sucesso.";
                resposta.Status = true;

                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = $"Erro ao buscar pagamentos: {ex.Message}";
                resposta.Status = false;
                return resposta;
            }
        }

        public async Task<ResponseModel<PagamentoModel>> CreatePagamentoAsync(CreatePagamentoDto createPagamentoDto)
        {
            var resposta = new ResponseModel<PagamentoModel>();

            try
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.Id == createPagamentoDto.ClienteId);

                if (cliente == null)
                {
                    resposta.Mensagem = "Cliente não encontrado.";
                    resposta.Status = false;
                    return resposta;
                }

                var novoPagamento = new PagamentoModel
                {
                    Valor = createPagamentoDto.Valor,
                    DataPagamento = createPagamentoDto.DataPagamento,
                    Status = 'A', // Aguardando pagamento
                    Cliente = cliente
                };

                _context.Pagamentos.Add(novoPagamento);
                await _context.SaveChangesAsync();

                resposta.Dados = novoPagamento;
                resposta.Mensagem = "Pagamento criado com sucesso.";
                resposta.Status = true;

                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = $"Erro ao criar o pagamento: {ex.Message}";
                resposta.Status = false;
                return resposta;
            }
        }

        public async Task<ResponseModel<PagamentoModel>> UpdateStatusPagamentoAsync(UpdatePagamentoDto updatePagamentoDto)
        {
            var resposta = new ResponseModel<PagamentoModel>();

            try
            {
                var pagamento = await _context.Pagamentos
                    .Include(p => p.Cliente)
                    .FirstOrDefaultAsync(p => p.Id == updatePagamentoDto.Id);

                if (pagamento == null)
                {
                    resposta.Mensagem = "Pagamento não encontrado.";
                    resposta.Status = false;
                    return resposta;
                }

                if (pagamento.Status == 'P' || pagamento.Status == 'C') // Pago ou Cancelado
                {
                    resposta.Mensagem = "Não é possível alterar o status de um pagamento já 'Pago' ou 'Cancelado'.";
                    return resposta;
                }

                if (updatePagamentoDto.Status != 'P' && updatePagamentoDto.Status != 'C')
                {
                    resposta.Mensagem = "O status deve ser 'P' (Pago) ou 'C' (Cancelado).";
                    return resposta;
                }

                pagamento.Status = updatePagamentoDto.Status;

                _context.Update(pagamento);
                await _context.SaveChangesAsync();

                resposta.Dados = pagamento;
                resposta.Mensagem = "Status atualizado com sucesso.";
                resposta.Status = true;

                return resposta;
            }
            catch (Exception ex)
            {
                resposta.Mensagem = $"Erro ao atualizar o status do pagamento: {ex.Message}";
                resposta.Status = false;
                return resposta;
            }
        }
    }
}
