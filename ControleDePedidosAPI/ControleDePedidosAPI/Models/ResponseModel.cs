using System;
using System.Collections.Generic;

namespace ControleDePedidosAPI.Models
{
    public class ResponseModel<T>
    {
        #nullable enable
        public T? Dados { get; set; }
        #nullable disable
        public string Mensagem { get; set; } = string.Empty;
        public bool Status { get; set; } = true;
    }
}
