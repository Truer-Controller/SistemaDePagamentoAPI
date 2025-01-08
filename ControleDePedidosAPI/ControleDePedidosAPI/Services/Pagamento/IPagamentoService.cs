using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDePedidosAPI.Dto.Pagamento;
using ControleDePedidosAPI.Models;

namespace ControleDePedidosAPI.Services.Pagamento
{
    public interface IPagamentoService
    {
        Task<ResponseModel<List<PagamentoModel>>> GetPagamentosPorClienteAsync(int idCliente);
        Task<ResponseModel<PagamentoModel>> CreatePagamentoAsync(CreatePagamentoDto createPagamentoDto);
        Task<ResponseModel<PagamentoModel>> UpdateStatusPagamentoAsync(UpdatePagamentoDto updatePagamentoDto);
    }
}
