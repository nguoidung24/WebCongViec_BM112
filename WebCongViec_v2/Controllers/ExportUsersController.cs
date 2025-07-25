using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic; // Thêm namespace này nếu bạn định nghĩa một List
using System.Linq;
using WebCongViec_v2.Services; // Thêm namespace này nếu bạn sử dụng LINQ

namespace WebCongViec_v2.Controllers
{
    public class ExportUsersController : Controller
    {
        protected ExportUsersService exportUsersController;
        public ExportUsersController()
        {
            this.exportUsersController = new ExportUsersService();
        }
        [Route("/exportusers")]
        public IActionResult Index()
        {
            var users = this.exportUsersController.getAllUsers();
            return Json(users);
        }
    }
}