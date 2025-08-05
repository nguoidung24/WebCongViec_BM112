using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Net.NetworkInformation;
using WebCongViec_v2.Middleware;
using WebCongViec_v2.Models;
using WebCongViec_v2.Services;

namespace WebCongViec_v2.Controllers
{
    public class LoginController : Controller
    {
        protected Bm112Context _context;
        protected AES256Service _aes256Service;
        public LoginController()
        {
            this._context = new Bm112Context();
            this._aes256Service = new AES256Service();
        }

/*        [Microsoft.AspNetCore.Mvc.Route("/login")]
        public IActionResult Index()
        {
            ViewBag.AppName = "CN - 13";
            var AppName = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("appname")).FirstOrDefault();
            if (AppName != null)
            {
                ViewBag.AppName = AppName.Data;
            }
            return View();
        }*/

        string? bm12Decode(string? input)
        {
            return input;
        }

        [Microsoft.AspNetCore.Mvc.Route("/login")]
        [HttpGet]
        public IActionResult Index(string? _username, string? _endDate)
        {
            string endDate = this._aes256Service.Decrypt(_endDate, "tdssohoa");
            string username = this._aes256Service.Decrypt(_username, "tdssohoa");
            string _format = "dd/MM/yyyy";

            if(endDate == null)
            {
                return Json("Ngày hết hạn không được trống");
            }
            string _input = endDate.Trim();
            if (DateOnly.TryParseExact(_input, _format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly inputDate))
            {
                DateOnly today = DateOnly.FromDateTime(DateTime.Today);

                if (inputDate < today)
                {
                    return Json("Ngày quá thời hạn");
                }
                else if (inputDate > today)
                {
                    return Json("Ngày quá thời hạn");
                }
                else
                {
                    Console.WriteLine("Ngày nhập vào là hôm nay.");
                }
            }
            else
            {
                return Json("Chuỗi ngày không hợp lệ.");
            }

            string? id = bm12Decode(username);
            string password = "12345678";
            string mac = "";
            NetworkInterface[] networkInterfaces = NetworkInterface.GetAllNetworkInterfaces();

            foreach (NetworkInterface netInterface in networkInterfaces)
            {
                if (netInterface.OperationalStatus == OperationalStatus.Up && netInterface.NetworkInterfaceType != NetworkInterfaceType.Loopback && netInterface.NetworkInterfaceType != NetworkInterfaceType.Tunnel)
                {
                    PhysicalAddress macAddress = netInterface.GetPhysicalAddress();
                    mac = macAddress.ToString();
                    break;
                }
            }
/*            if (!mac.Equals("00090FAA0001"))
            {
                return View();
            }
*/
            if (id != null && password != null)
            {
                if (!id.Equals("") && !password.Equals(""))
                {
                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin.txt");

                    if (System.IO.File.Exists(filePath))
                    {
                        string fileContent = System.IO.File.ReadAllText(filePath);
                        if (id.Equals(fileContent))
                        {
                            var isAdmin = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("0")).First();
                            if (isAdmin != null)
                                if (password.Equals(isAdmin.Data))
                                {
                                    HttpContext.Session.SetString("isLogin", "1");
                                    HttpContext.Session.SetString("DisplayName", "Admin");
                                    HttpContext.Session.SetString("role", "1");
                                    HttpContext.Session.SetString("ID", "Admin");
                                    return RedirectToAction("Index", "/");
                                }
                        }
                    }

                    Nhansu? check = _context.Nhansus.Where(row => row.IdNhanSu.ToString().Equals(id) && row.Password.Equals(password)).FirstOrDefault();
                    if (check != null)
                    {
                        HttpContext.Session.SetString("isLogin", "1");
                        HttpContext.Session.SetString("DisplayName", check.HoTenNhanSu);
                        HttpContext.Session.SetString("ID", check.IdNhanSu.ToString());
                        HttpContext.Session.SetString("userrole", check.Role.ToString());
                        HttpContext.Session.SetString("HasInfo", check.Status.ToString());
                        HttpContext.Session.SetString("role", "0");
                        return RedirectToAction("Index", "HomeUsers");
                    }
                }
            }
            return RedirectToAction("Index", "Login");
        }
    }
}





//using Microsoft.AspNetCore.Components;
//using Microsoft.AspNetCore.Mvc;
//using System.Net.NetworkInformation;
//using WebCongViec_v2.Middleware;
//using WebCongViec_v2.Models;

//namespace WebCongViec_v2.Controllers
//{
//    public class LoginController : Controller
//    {
//        protected Bm112Context _context;
//        public LoginController()
//        {
//            this._context = new Bm112Context();
//        }

//        [Microsoft.AspNetCore.Mvc.Route("/login")]
//        public IActionResult Index()
//        {
//            ViewBag.AppName = "CN - 13";
//            var AppName = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("appname")).FirstOrDefault();
//            if (AppName != null)
//            {
//                ViewBag.AppName = AppName.Data;
//            }
//            return View();
//        }



//        [Microsoft.AspNetCore.Mvc.Route("/login")]
//        [HttpPost]
//        public IActionResult Index(string id, string password)
//        {
//            /* string mac = "";
//             NetworkInterface[] networkInterfaces = NetworkInterface.GetAllNetworkInterfaces();

//             foreach (NetworkInterface netInterface in networkInterfaces)
//             {
//                 if (netInterface.OperationalStatus == OperationalStatus.Up && netInterface.NetworkInterfaceType != NetworkInterfaceType.Loopback && netInterface.NetworkInterfaceType != NetworkInterfaceType.Tunnel)
//                 {
//                     PhysicalAddress macAddress = netInterface.GetPhysicalAddress();
//                     mac = macAddress.ToString();
//                     break;
//                 }
//             }
//             if (!mac.Equals("00090FAA0001"))
//             {
//                 return View();
//             }*/

//            if (id != null && password != null)
//            {
//                if (!id.Equals("") && !password.Equals(""))
//                {
//                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin.txt");

//                    if (System.IO.File.Exists(filePath))
//                    {
//                        string fileContent = System.IO.File.ReadAllText(filePath);
//                        if (id.Equals(fileContent))
//                        {
//                            var isAdmin = _context.DbWebChamCongV3s.Where(row => row.Id.Equals("0")).First();
//                            if (isAdmin != null)
//                                if (password.Equals(isAdmin.Data))
//                                {
//                                    HttpContext.Session.SetString("isLogin", "1");
//                                    HttpContext.Session.SetString("DisplayName", "Admin");
//                                    HttpContext.Session.SetString("role", "1");
//                                    HttpContext.Session.SetString("ID", "Admin");
//                                    return RedirectToAction("Index", "/");
//                                }
//                        }
//                    }

//                    Nhansu? check = _context.Nhansus.Where(row => row.IdNhanSu.ToString().Equals(id) && row.Password.Equals(password)).FirstOrDefault();
//                    if (check != null)
//                    {
//                        HttpContext.Session.SetString("isLogin", "1");
//                        HttpContext.Session.SetString("DisplayName", check.HoTenNhanSu);
//                        HttpContext.Session.SetString("ID", check.IdNhanSu.ToString());
//                        HttpContext.Session.SetString("userrole", check.Role.ToString());
//                        HttpContext.Session.SetString("HasInfo", check.Status.ToString());
//                        HttpContext.Session.SetString("role", "0");
//                        return RedirectToAction("Index", "HomeUsers");
//                    }
//                }
//            }
//            return RedirectToAction("Index", "Login");
//        }
//    }
//}
