using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleDePedidosAPI.Dto.Cliente;
using ControleDePedidosAPI.Dto.Pagamento;
using ControleDePedidosAPI.Models;
using ControleDePedidosAPI.Services.Cliente;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleDePedidosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _clienteService;
        public ClientesController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseModel<List<ClienteModel>>>> GetClientesAsync()
        {
            try
            {
                var clientes = await _clienteService.GetClientesAsync();
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel<List<ClienteModel>>
                {
                    Mensagem = $"Erro ao recuperar clientes: {ex.Message}",
                    Status = false
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResponseModel<ClienteModel>>> CreateClienteAsync(CreateClienteDto createClienteDto)
        {
            try
            {
                var cliente = await _clienteService.CreateClienteAsync(createClienteDto);
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel<ClienteModel>
                {
                    Mensagem = $"Erro ao criar cliente: {ex.Message}",
                    Status = false
                });
            }
        }
    }
}
