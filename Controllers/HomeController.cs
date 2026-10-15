using Microsoft.AspNetCore.Mvc;
using Saudi_House.Models;
using Saudi_House.Services;
using System.Diagnostics;

namespace Saudi_House.Controllers
{
    public class HomeController : Controller
    {
        private readonly IAbayaService _abayaService;

        public HomeController(IAbayaService abayaService)
        {
            _abayaService = abayaService;
        }

        public IActionResult Index()
        {
            var abayas = _abayaService.GetAll();
            return View(abayas);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
