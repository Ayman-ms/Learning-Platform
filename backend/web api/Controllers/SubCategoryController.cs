using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using .Data;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoryController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public SubCategoryController(SkillWaveDbContext context)
        {
            _context = context;
        }

        // GET: api/SubCategory
        [HttpGet]
        public async Task<IActionResult> GetAllSubCategories()
        {
            var subCategories = await _context.SubCategories
                                              .Include(sc => sc.MainCategory)
                                              .ToListAsync();
            return Ok(subCategories);
        }

        // GET: api/SubCategory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubCategoryById(int id)
        {
            var subCategory = await _context.SubCategories
                                            .Include(sc => sc.MainCategory)
                                            .FirstOrDefaultAsync(sc => sc.SubCategoryID == id);

            if (subCategory == null)
                return NotFound($"SubCategory with ID {id} not found.");

            return Ok(subCategory);
        }

        // POST: api/SubCategory
        [HttpPost]
        public async Task<IActionResult> CreateSubCategory([FromBody] SubCategory subCategory)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");

            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubCategoryById), new { id = subCategory.SubCategoryID }, subCategory);
        }

        // PUT: api/SubCategory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubCategory(int id, [FromBody] SubCategory updatedSubCategory)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);

            if (subCategory == null)
                return NotFound($"SubCategory with ID {id} not found.");

            subCategory.Name = updatedSubCategory.Name;
            subCategory.MainCategory = updatedSubCategory.MainCategory;

            _context.SubCategories.Update(subCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/SubCategory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);

            if (subCategory == null)
                return NotFound($"SubCategory with ID {id} not found.");

            _context.SubCategories.Remove(subCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
