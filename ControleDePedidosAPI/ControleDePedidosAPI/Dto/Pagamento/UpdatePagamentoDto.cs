using System.Text.Json.Serialization;
using ControleDePedidosAPI.Dto.Vinculo;

namespace ControleDePedidosAPI.Dto.Pagamento
{
    public class UpdatePagamentoDto
    {
        public int Id { get; set; }
        public char Status { get; set; }
    }
}
