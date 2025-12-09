import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import '../providers/job_provider.dart';
import '../models/job.dart';
import '../widgets/info_card.dart';

class JobDetailScreen extends ConsumerStatefulWidget {
  final String jobId;

  const JobDetailScreen({super.key, required this.jobId});

  @override
  ConsumerState<JobDetailScreen> createState() => _JobDetailScreenState();
}

class _JobDetailScreenState extends ConsumerState<JobDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final jobAsync = ref.watch(jobDetailProvider(widget.jobId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Job Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share functionality
            },
          ),
          IconButton(
            icon: const Icon(Icons.bookmark_border),
            onPressed: () {
              // Bookmark functionality
            },
          ),
        ],
      ),
      body: jobAsync.when(
        data: (job) => _buildJobDetails(job),
        loading: () => const Center(child: CircularProgressIndicator()),
        error:
            (error, stack) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(error.toString()),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed:
                        () => ref.refresh(jobDetailProvider(widget.jobId)),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
      ),
    );
  }

  Widget _buildJobDetails(Job job) {
    return Column(
      children: [
        // Job Header
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Theme.of(context).colorScheme.primary,
                Theme.of(context).colorScheme.primaryContainer,
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                job.title,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                job.organization,
                style: const TextStyle(color: Colors.white70, fontSize: 16),
              ),
              if (job.daysRemaining != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color:
                        job.daysRemaining! > 10 ? Colors.green : Colors.orange,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${job.daysRemaining} days remaining',
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ),
              ],
            ],
          ),
        ),

        // Tabs
        TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Details'),
            Tab(text: 'Videos'),
          ],
        ),

        // Tab Content
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildOverviewTab(job),
              _buildDetailsTab(job),
              _buildVideosTab(job),
            ],
          ),
        ),

        // Bottom Buttons
        _buildBottomButtons(job),
      ],
    );
  }

  Widget _buildOverviewTab(Job job) {
    final aiSummary = job.aiSummary;
    if (aiSummary == null) {
      return const Center(child: Text('No AI summary available'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // AI Summary
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'AI Summary',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    aiSummary.shortSummary,
                    style: const TextStyle(fontSize: 15, height: 1.5),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Important Dates
          if (aiSummary.importantPoints.importantDates.applicationEnd != null)
            InfoCard(
              icon: Icons.calendar_today,
              title: 'Important Dates',
              children: [
                if (aiSummary.importantPoints.importantDates.applicationStart !=
                    null)
                  _buildInfoRow(
                    'Application Start',
                    _formatDate(
                      aiSummary
                          .importantPoints
                          .importantDates
                          .applicationStart!,
                    ),
                  ),
                if (aiSummary.importantPoints.importantDates.applicationEnd !=
                    null)
                  _buildInfoRow(
                    'Application End',
                    _formatDate(
                      aiSummary.importantPoints.importantDates.applicationEnd!,
                    ),
                  ),
                if (aiSummary.importantPoints.importantDates.examDate != null)
                  _buildInfoRow(
                    'Exam Date',
                    _formatDate(
                      aiSummary.importantPoints.importantDates.examDate!,
                    ),
                  ),
              ],
            ),

          const SizedBox(height: 16),

          // Vacancies
          if (aiSummary.importantPoints.vacancies != null)
            InfoCard(
              icon: Icons.people,
              title: 'Vacancies',
              children: [
                _buildInfoRow(
                  'Total',
                  aiSummary.importantPoints.vacancies!.total.toString(),
                ),
                if (aiSummary.importantPoints.vacancies!.category.ur > 0)
                  _buildInfoRow(
                    'UR',
                    aiSummary.importantPoints.vacancies!.category.ur.toString(),
                  ),
                if (aiSummary.importantPoints.vacancies!.category.obc > 0)
                  _buildInfoRow(
                    'OBC',
                    aiSummary.importantPoints.vacancies!.category.obc
                        .toString(),
                  ),
                if (aiSummary.importantPoints.vacancies!.category.sc > 0)
                  _buildInfoRow(
                    'SC',
                    aiSummary.importantPoints.vacancies!.category.sc.toString(),
                  ),
                if (aiSummary.importantPoints.vacancies!.category.st > 0)
                  _buildInfoRow(
                    'ST',
                    aiSummary.importantPoints.vacancies!.category.st.toString(),
                  ),
              ],
            ),

          const SizedBox(height: 16),

          // Age Limit
          if (aiSummary.importantPoints.ageLimit != null)
            InfoCard(
              icon: Icons.cake,
              title: 'Age Limit',
              children: [
                _buildInfoRow(
                  'Minimum',
                  '${aiSummary.importantPoints.ageLimit!.min ?? "N/A"} years',
                ),
                _buildInfoRow(
                  'Maximum',
                  '${aiSummary.importantPoints.ageLimit!.max ?? "N/A"} years',
                ),
                if (aiSummary.importantPoints.ageLimit!.relaxation != null)
                  _buildInfoRow(
                    'Relaxation',
                    aiSummary.importantPoints.ageLimit!.relaxation!,
                  ),
              ],
            ),

          const SizedBox(height: 16),

          // Application Fees
          if (aiSummary.importantPoints.applicationFees != null)
            InfoCard(
              icon: Icons.payments,
              title: 'Application Fees',
              children: [
                if (aiSummary.importantPoints.applicationFees!.general != null)
                  _buildInfoRow(
                    'General',
                    '₹${aiSummary.importantPoints.applicationFees!.general}',
                  ),
                if (aiSummary.importantPoints.applicationFees!.obc != null)
                  _buildInfoRow(
                    'OBC',
                    '₹${aiSummary.importantPoints.applicationFees!.obc}',
                  ),
                if (aiSummary.importantPoints.applicationFees!.scst != null)
                  _buildInfoRow(
                    'SC/ST',
                    '₹${aiSummary.importantPoints.applicationFees!.scst}',
                  ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildDetailsTab(Job job) {
    final aiSummary = job.aiSummary;
    if (aiSummary == null) {
      return const Center(child: Text('No details available'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Eligibility
          if (aiSummary.importantPoints.eligibility.isNotEmpty)
            InfoCard(
              icon: Icons.check_circle,
              title: 'Eligibility',
              children:
                  aiSummary.importantPoints.eligibility
                      .map(
                        (e) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('• '),
                              Expanded(child: Text(e)),
                            ],
                          ),
                        ),
                      )
                      .toList(),
            ),

          const SizedBox(height: 16),

          // Qualification
          if (aiSummary.importantPoints.qualification.isNotEmpty)
            InfoCard(
              icon: Icons.school,
              title: 'Qualification',
              children:
                  aiSummary.importantPoints.qualification
                      .map(
                        (q) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('• '),
                              Expanded(child: Text(q)),
                            ],
                          ),
                        ),
                      )
                      .toList(),
            ),

          const SizedBox(height: 16),

          // Selection Process
          if (aiSummary.importantPoints.selectionProcess.isNotEmpty)
            InfoCard(
              icon: Icons.format_list_numbered,
              title: 'Selection Process',
              children:
                  aiSummary.importantPoints.selectionProcess
                      .asMap()
                      .entries
                      .map(
                        (entry) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Text('${entry.key + 1}. ${entry.value}'),
                        ),
                      )
                      .toList(),
            ),

          const SizedBox(height: 16),

          // Salary
          if (aiSummary.importantPoints.salary != null)
            InfoCard(
              icon: Icons.attach_money,
              title: 'Salary',
              children: [Text(aiSummary.importantPoints.salary!)],
            ),

          const SizedBox(height: 16),

          // How to Apply
          if (aiSummary.importantPoints.howToApply != null)
            InfoCard(
              icon: Icons.assignment,
              title: 'How to Apply',
              children: [Text(aiSummary.importantPoints.howToApply!)],
            ),
        ],
      ),
    );
  }

  Widget _buildVideosTab(Job job) {
    final videosAsync = ref.watch(jobResourcesProvider(widget.jobId));

    return videosAsync.when(
      data: (videos) {
        if (videos.isEmpty) {
          return const Center(child: Text('No videos available'));
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: videos.length,
          itemBuilder: (context, index) {
            final video = videos[index];
            return _buildVideoCard(video);
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(child: Text(error.toString())),
    );
  }

  Widget _buildVideoCard(YouTubeVideo video) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => _launchUrl(video.videoUrl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Image.network(
                video.thumbnail,
                fit: BoxFit.cover,
                errorBuilder:
                    (_, __, ___) => Container(
                      color: Colors.grey[300],
                      child: const Icon(Icons.error),
                    ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    video.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    video.channelName,
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${_formatNumber(video.viewCount)} views',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomButtons(Job job) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          if (job.pdfUrl != null)
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _launchUrl(job.pdfUrl!),
                icon: const Icon(Icons.picture_as_pdf),
                label: const Text('PDF'),
              ),
            ),
          if (job.pdfUrl != null) const SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: ElevatedButton.icon(
              onPressed:
                  job.applicationUrl != null
                      ? () => _launchUrl(job.applicationUrl!)
                      : null,
              icon: const Icon(Icons.open_in_new),
              label: const Text('Apply Now'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(value, style: TextStyle(color: Colors.grey[700])),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
