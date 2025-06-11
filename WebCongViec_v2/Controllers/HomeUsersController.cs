using Microsoft.AspNetCore.Mvc;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services.UsersService;

namespace WebCongViec_v2.Controllers
{
    public class HomeUsersController : Controller
    {

        protected HomeUsersService homeUsersService;
        public HomeUsersController()
        {
            this.homeUsersService = new HomeUsersService();
        }
        [Route("/homeusers")]
        public IActionResult Index(string isChamCong)
        {
            string? ID = HttpContext.Session.GetString("ID");
            string? DisplayName = HttpContext.Session.GetString("DisplayName");
            string? UserRole = HttpContext.Session.GetString("userrole");
            ViewBag.Name = ID + " - " +DisplayName;

            DateTime now = DateTime.Now;
            string NgayHienTai = now.ToString("yyyy-MM-dd");
            ViewBag.NgayHienTai = NgayHienTai;

            ViewBag.DSCong = this.homeUsersService.BangCongUser(ID);
            return View();
        }

    }
}
