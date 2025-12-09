import 'package:flutter/material.dart';

class CategoryFilter extends StatelessWidget {
  final String? selectedCategory;
  final Function(String?) onCategorySelected;

  const CategoryFilter({
    super.key,
    required this.selectedCategory,
    required this.onCategorySelected,
  });

  static const categories = [
    {'name': 'All', 'icon': Icons.apps, 'value': null},
    {'name': 'Engineering', 'icon': Icons.engineering, 'value': 'Engineering'},
    {'name': 'Teaching', 'icon': Icons.school, 'value': 'Teaching'},
    {'name': 'Police', 'icon': Icons.local_police, 'value': 'Police'},
    {'name': 'Medical', 'icon': Icons.medical_services, 'value': 'Medical'},
    {'name': 'Banking', 'icon': Icons.account_balance, 'value': 'Banking'},
    {'name': 'Railway', 'icon': Icons.train, 'value': 'Railway'},
    {
      'name': 'Administrative',
      'icon': Icons.business,
      'value': 'Administrative'
    },
    {'name': 'Other', 'icon': Icons.more_horiz, 'value': 'Other'},
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          final isSelected = selectedCategory == category['value'];

          return GestureDetector(
            onTap: () => onCategorySelected(category['value'] as String?),
            child: Container(
              width: 80,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: isSelected
                    ? Theme.of(context).colorScheme.primaryContainer
                    : Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? Theme.of(context).colorScheme.primary
                      : Colors.transparent,
                  width: 2,
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    category['icon'] as IconData,
                    color: isSelected
                        ? Theme.of(context).colorScheme.primary
                        : Colors.grey[600],
                    size: 28,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    category['name'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight:
                          isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected
                          ? Theme.of(context).colorScheme.primary
                          : Colors.grey[700],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
