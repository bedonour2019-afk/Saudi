using System.Text.Json;
using Saudi_House.Models;

namespace Saudi_House.Services
{
    public interface IAbayaService
    {
        List<Abaya> GetAll();
        Abaya? GetById(int id);
        void Add(Abaya abaya);
        bool Delete(int id);
    }

    public class AbayaService : IAbayaService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _filePath;
        private static readonly object _lock = new();

        public AbayaService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _filePath = Path.Combine(_environment.WebRootPath, "data", "abayas.json");
        }

        public List<Abaya> GetAll()
        {
            lock (_lock)
            {
                if (!File.Exists(_filePath))
                {
                    return new List<Abaya>();
                }

                try
                {
                    var json = File.ReadAllText(_filePath);
                    var list = JsonSerializer.Deserialize<List<Abaya>>(json, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    return list ?? new List<Abaya>();
                }
                catch
                {
                    return new List<Abaya>();
                }
            }
        }

        public Abaya? GetById(int id)
        {
            return GetAll().FirstOrDefault(a => a.Id == id);
        }

        public void Add(Abaya abaya)
        {
            lock (_lock)
            {
                var list = GetAll();
                int nextId = list.Count > 0 ? list.Max(a => a.Id) + 1 : 1;
                abaya.Id = nextId;

                // Auto set CategoryName if needed
                if (string.IsNullOrWhiteSpace(abaya.CategoryName))
                {
                    abaya.CategoryName = abaya.Category switch
                    {
                        "royal" => "الكولكشن الملكي",
                        "occasions" => "كولكشن السهرات والمناسبات",
                        "bisht" => "قسم البشت والكبك",
                        "casual" => "كولكشن الدوام واليومي",
                        "scarves" => "الطرح والنقابات",
                        _ => "تشكيلة خاصة"
                    };
                }

                if (string.IsNullOrWhiteSpace(abaya.ImageUrl))
                {
                    abaya.ImageUrl = "/images/logo.jpg";
                }

                list.Insert(0, abaya);
                Save(list);
            }
        }

        public bool Delete(int id)
        {
            lock (_lock)
            {
                var list = GetAll();
                var item = list.FirstOrDefault(a => a.Id == id);
                if (item != null)
                {
                    list.Remove(item);
                    Save(list);
                    return true;
                }
                return false;
            }
        }

        private void Save(List<Abaya> list)
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(list, options);
            File.WriteAllText(_filePath, json);
        }
    }
}
