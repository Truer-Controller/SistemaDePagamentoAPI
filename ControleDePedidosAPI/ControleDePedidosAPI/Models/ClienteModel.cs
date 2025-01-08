using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ControleDePedidosAPI.Models
{
    public class ClienteModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(80, ErrorMessage = "O nome não pode exceder 80 caracteres.")]
        public string Nome { get; set; }
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail fornecido não é válido.")]
        [StringLength(100, ErrorMessage = "O email não pode exceder 100 caracteres.")]
        public string Email { get; set; }
        [JsonIgnore]
        public ICollection<PagamentoModel> Pagamentos { get; set; }
    }
}
