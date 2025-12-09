import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/job.dart';
import '../services/api_service.dart';

/// State for jobs list
class JobsState {
  final List<Job> jobs;
  final bool isLoading;
  final String? error;
  final int currentPage;
  final int totalPages;
  final bool hasMore;

  JobsState({
    this.jobs = const [],
    this.isLoading = false,
    this.error,
    this.currentPage = 1,
    this.totalPages = 1,
    this.hasMore = true,
  });

  JobsState copyWith({
    List<Job>? jobs,
    bool? isLoading,
    String? error,
    int? currentPage,
    int? totalPages,
    bool? hasMore,
  }) {
    return JobsState(
      jobs: jobs ?? this.jobs,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

/// Jobs provider using StateNotifier
class JobsNotifier extends StateNotifier<JobsState> {
  JobsNotifier() : super(JobsState());

  String? _currentCategory;
  String? _currentStatus;

  /// Fetch jobs with pagination
  Future<void> fetchJobs({
    int page = 1,
    String? category,
    String? status,
    bool loadMore = false,
  }) async {
    if (state.isLoading) return;

    _currentCategory = category;
    _currentStatus = status;

    if (loadMore) {
      if (!state.hasMore || page > state.totalPages) return;
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final response = await ApiService.getJobs(
        page: page,
        limit: 10,
        category: category,
        status: status,
        sortBy: 'postedDate',
        order: 'desc',
      );

      final newJobs =
          loadMore ? [...state.jobs, ...response.jobs] : response.jobs;

      state = state.copyWith(
        jobs: newJobs,
        isLoading: false,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        hasMore: response.currentPage < response.totalPages,
        error: null,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  /// Load more jobs
  Future<void> loadMore() async {
    if (!state.hasMore || state.isLoading) return;
    await fetchJobs(
      page: state.currentPage + 1,
      category: _currentCategory,
      status: _currentStatus,
      loadMore: true,
    );
  }

  /// Refresh jobs
  Future<void> refresh() async {
    state = JobsState();
    await fetchJobs(
      category: _currentCategory,
      status: _currentStatus,
    );
  }

  /// Filter by category
  Future<void> filterByCategory(String? category) async {
    state = JobsState();
    await fetchJobs(category: category, status: _currentStatus);
  }

  /// Filter by status
  Future<void> filterByStatus(String? status) async {
    state = JobsState();
    await fetchJobs(category: _currentCategory, status: status);
  }
}

/// Jobs provider
final jobsProvider = StateNotifierProvider<JobsNotifier, JobsState>((ref) {
  return JobsNotifier();
});

/// Featured jobs provider
final featuredJobsProvider = FutureProvider<List<Job>>((ref) async {
  return await ApiService.getFeaturedJobs(limit: 5);
});

/// Single job provider
final jobDetailProvider =
    FutureProvider.family<Job, String>((ref, jobId) async {
  // Increment view count
  ApiService.incrementView(jobId);
  return await ApiService.getJobById(jobId);
});

/// Job resources (YouTube videos) provider
final jobResourcesProvider = FutureProvider.family<List<YouTubeVideo>, String>(
  (ref, jobId) async {
    return await ApiService.getJobResources(jobId);
  },
);

/// Search provider
final searchProvider = StateProvider<String>((ref) => '');

/// Search results provider
final searchResultsProvider = FutureProvider<List<Job>>((ref) async {
  final query = ref.watch(searchProvider);
  if (query.isEmpty) return [];
  return await ApiService.searchJobs(query: query);
});
