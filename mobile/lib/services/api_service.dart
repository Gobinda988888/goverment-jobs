import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../models/job.dart';

/// API Service for communicating with backend
class ApiService {
  static late Dio _dio;
  static const String baseUrl =
      'https://goverment-jobs.onrender.com/api'; // Production backend URL

  /// Initialize Dio client
  static Future<void> initialize() async {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add logging interceptor in debug mode
    _dio.interceptors.add(
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: true,
      ),
    );

    // Add error interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onError: (DioException e, handler) {
          print('API Error: ${e.message}');
          return handler.next(e);
        },
      ),
    );
  }

  /// Get all jobs with optional filters
  static Future<JobsResponse> getJobs({
    int page = 1,
    int limit = 10,
    String? status,
    String? category,
    String? sortBy,
    String? order,
  }) async {
    try {
      final queryParams = {
        'page': page,
        'limit': limit,
        if (status != null) 'status': status,
        if (category != null) 'category': category,
        if (sortBy != null) 'sortBy': sortBy,
        if (order != null) 'order': order,
      };

      final response = await _dio.get('/jobs', queryParameters: queryParams);

      return JobsResponse.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Get single job by ID
  static Future<Job> getJobById(String jobId) async {
    try {
      final response = await _dio.get('/jobs/$jobId');
      return Job.fromJson(response.data['data']);
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Get featured jobs
  static Future<List<Job>> getFeaturedJobs({int limit = 5}) async {
    try {
      final response = await _dio.get(
        '/jobs/featured',
        queryParameters: {'limit': limit},
      );

      final List<dynamic> data = response.data['data'];
      return data.map((json) => Job.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Search jobs
  static Future<List<Job>> searchJobs({
    required String query,
    String? category,
    String? status,
  }) async {
    try {
      final queryParams = {
        'q': query,
        if (category != null) 'category': category,
        if (status != null) 'status': status,
      };

      final response = await _dio.get(
        '/jobs/search',
        queryParameters: queryParams,
      );

      final List<dynamic> data = response.data['data'];
      return data.map((json) => Job.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Get YouTube resources for a job
  static Future<List<YouTubeVideo>> getJobResources(String jobId) async {
    try {
      final response = await _dio.get('/jobs/$jobId/resources');

      final List<dynamic> data = response.data['data'];
      return data.map((json) => YouTubeVideo.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  /// Increment view count for a job
  static Future<void> incrementView(String jobId) async {
    try {
      await _dio.patch('/jobs/$jobId/view');
    } catch (e) {
      // Silently fail for view count
      print('Failed to increment view: $e');
    }
  }

  /// Handle errors
  static String _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return 'Connection timeout. Please check your internet connection.';
        case DioExceptionType.badResponse:
          final statusCode = error.response?.statusCode;
          if (statusCode == 404) {
            return 'Resource not found.';
          } else if (statusCode == 500) {
            return 'Server error. Please try again later.';
          }
          return error.response?.data['message'] ?? 'Something went wrong.';
        case DioExceptionType.cancel:
          return 'Request cancelled.';
        default:
          return 'Network error. Please check your connection.';
      }
    }
    return 'An unexpected error occurred.';
  }
}

/// Response wrapper for jobs list
class JobsResponse {
  final bool success;
  final int count;
  final int total;
  final int totalPages;
  final int currentPage;
  final List<Job> jobs;

  JobsResponse({
    required this.success,
    required this.count,
    required this.total,
    required this.totalPages,
    required this.currentPage,
    required this.jobs,
  });

  factory JobsResponse.fromJson(Map<String, dynamic> json) {
    final List<dynamic> data = json['data'] ?? [];
    return JobsResponse(
      success: json['success'] ?? false,
      count: json['count'] ?? 0,
      total: json['total'] ?? 0,
      totalPages: json['totalPages'] ?? 0,
      currentPage: json['currentPage'] ?? 1,
      jobs: data.map((job) => Job.fromJson(job)).toList(),
    );
  }
}
