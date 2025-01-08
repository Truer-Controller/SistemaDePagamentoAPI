using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDePedidosAPI.Dto.Cliente;
using ControleDePedidosAPI.Models;

namespace ControleDePedidosAPI.Services.Cliente
{
    public interface IClienteService
    {
        Task<ResponseModel<List<ClienteModel>>> CreateClienteAsync(CreateClienteDto createClienteDto);
        Task<ResponseModel<List<ClienteModel>>> GetClientesAsync();
    }
}
