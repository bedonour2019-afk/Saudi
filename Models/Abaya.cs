namespace Saudi_House.Models
{
    public class Abaya
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "royal"; // royal, occasions, casual, bisht, scarves
        public string CategoryName { get; set; } = "الكولكشن الملكي";
        public string Fabric { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Badge { get; set; } = "الأكثر طلباً";
        public string BadgeIcon { get; set; } = "fa-crown";
        public string Sizes { get; set; } = "50-60";
        public string ImageUrl { get; set; } = string.Empty;
        public string PriceInfo { get; set; } = "سعر خاص بالفرع";
    }
}
