using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace SkillwaveAPI.Services
{
    public class JsonFileService<T>
    {
        private readonly string _filePath;

        public JsonFileService(string filePath)
        {
            _filePath = filePath;
        }

        public async Task<List<T>> ReadAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List<T>();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<T>>(json);
        }

        public async Task WriteAsync(List<T> items)
        {
            var json = JsonSerializer.Serialize(items);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}
