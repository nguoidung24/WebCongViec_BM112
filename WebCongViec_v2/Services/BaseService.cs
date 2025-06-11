using WebCongViec_v2.Models;

namespace WebCongViec_v2.Services
{
    public class BaseService
    {
        protected Bm112Context DbContext;
        public BaseService()
        {
            this.DbContext = new Bm112Context();
        }

        protected DateOnly StringToDate(string input, string inputType = "yyyy-mm-dd", string outputType = "dd-mm-yyyy")
        {
            var output = new DateOnly();
            /*Code write...*/
            return output;
        }
    }
}
