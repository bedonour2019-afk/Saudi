using Microsoft.AspNetCore.Mvc;
using Saudi_House.Models;
using Saudi_House.Services;

namespace Saudi_House.Controllers
{
    public class AdminController : Controller
    {
        private readonly IAbayaService _abayaService;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public AdminController(IAbayaService abayaService, IWebHostEnvironment environment, IConfiguration configuration)
        {
            _abayaService = abayaService;
            _environment = environment;
            _configuration = configuration;
        }

        private string GetAdminPassword()
        {
            return _configuration["AdminSettings:Password"] ?? "saudi";
        }

        private bool IsAuthenticated()
        {
            return HttpContext.Session.GetString("IsAdmin") == "true";
        }

        // GET: /Admin
        public IActionResult Index()
        {
            if (!IsAuthenticated())
            {
                return RedirectToAction(nameof(Login));
            }

            var abayas = _abayaService.GetAll();
            return View(abayas);
        }

        // GET: /Admin/Login
        public IActionResult Login()
        {
            if (IsAuthenticated())
            {
                return RedirectToAction(nameof(Index));
            }
            return View();
        }

        // POST: /Admin/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(string password)
        {
            if (password == GetAdminPassword())
            {
                HttpContext.Session.SetString("IsAdmin", "true");
                TempData["AdminSuccess"] = "مرحباً بكِ في لوحة تحكم البيت السعودي ✨";
                return RedirectToAction(nameof(Index));
            }

            ViewBag.ErrorMessage = "كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.";
            return View();
        }

        // POST: /Admin/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(Abaya model, IFormFile? imageUpload)
        {
            if (!IsAuthenticated())
            {
                return RedirectToAction(nameof(Login));
            }

            if (ModelState.IsValid)
            {
                if (imageUpload != null && imageUpload.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "abayas");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string uniqueFileName = Guid.NewGuid().ToString("N")[..8] + "_" + Path.GetFileName(imageUpload.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageUpload.CopyToAsync(fileStream);
                    }

                    model.ImageUrl = "/images/abayas/" + uniqueFileName;
                }

                _abayaService.Add(model);
                TempData["AdminSuccess"] = $"تمت إضافة «{model.Title}» بنجاح إلى المعرض! ✨";
            }

            return RedirectToAction(nameof(Index));
        }

        // POST: /Admin/Delete
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            if (!IsAuthenticated())
            {
                return RedirectToAction(nameof(Login));
            }

            bool deleted = _abayaService.Delete(id);
            if (deleted)
            {
                TempData["AdminSuccess"] = "تم حذف العباية بنجاح من المعرض.";
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: /Admin/Logout
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("IsAdmin");
            return RedirectToAction(nameof(Login));
        }
    }
}
