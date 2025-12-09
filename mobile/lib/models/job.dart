/// Job model representing government job data
class Job {
  final String id;
  final String title;
  final String organization;
  final String? department;
  final String notificationUrl;
  final String? applicationUrl;
  final String? pdfUrl;
  final AISummary? aiSummary;
  final List<YouTubeVideo> youtubeVideos;
  final String category;
  final List<String> tags;
  final String status;
  final DateTime postedDate;
  final DateTime lastUpdated;
  final int viewCount;
  final int bookmarkCount;
  final bool isVerified;
  final bool isFeatured;
  final int? daysRemaining;

  Job({
    required this.id,
    required this.title,
    required this.organization,
    this.department,
    required this.notificationUrl,
    this.applicationUrl,
    this.pdfUrl,
    this.aiSummary,
    this.youtubeVideos = const [],
    required this.category,
    this.tags = const [],
    required this.status,
    required this.postedDate,
    required this.lastUpdated,
    this.viewCount = 0,
    this.bookmarkCount = 0,
    this.isVerified = false,
    this.isFeatured = false,
    this.daysRemaining,
  });

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      organization: json['organization'] ?? '',
      department: json['department'],
      notificationUrl: json['notificationUrl'] ?? '',
      applicationUrl: json['applicationUrl'],
      pdfUrl: json['pdfUrl'],
      aiSummary: json['aiSummary'] != null
          ? AISummary.fromJson(json['aiSummary'])
          : null,
      youtubeVideos: json['youtubeVideos'] != null
          ? (json['youtubeVideos'] as List)
              .map((v) => YouTubeVideo.fromJson(v))
              .toList()
          : [],
      category: json['category'] ?? 'Other',
      tags: json['tags'] != null ? List<String>.from(json['tags']) : [],
      status: json['status'] ?? 'active',
      postedDate: DateTime.parse(json['postedDate'] ?? json['createdAt']),
      lastUpdated: DateTime.parse(json['lastUpdated'] ?? json['updatedAt']),
      viewCount: json['viewCount'] ?? 0,
      bookmarkCount: json['bookmarkCount'] ?? 0,
      isVerified: json['isVerified'] ?? false,
      isFeatured: json['isFeatured'] ?? false,
      daysRemaining: json['daysRemaining'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'organization': organization,
      'department': department,
      'notificationUrl': notificationUrl,
      'applicationUrl': applicationUrl,
      'pdfUrl': pdfUrl,
      'category': category,
      'tags': tags,
      'status': status,
    };
  }
}

/// AI-generated summary and important points
class AISummary {
  final String shortSummary;
  final ImportantPoints importantPoints;

  AISummary({
    required this.shortSummary,
    required this.importantPoints,
  });

  factory AISummary.fromJson(Map<String, dynamic> json) {
    return AISummary(
      shortSummary: json['shortSummary'] ?? '',
      importantPoints: ImportantPoints.fromJson(json['importantPoints'] ?? {}),
    );
  }
}

/// Important job details extracted by AI
class ImportantPoints {
  final List<String> eligibility;
  final ImportantDates importantDates;
  final AgeLimit? ageLimit;
  final List<String> qualification;
  final Vacancies? vacancies;
  final ApplicationFees? applicationFees;
  final List<String> selectionProcess;
  final String? salary;
  final String? howToApply;

  ImportantPoints({
    this.eligibility = const [],
    required this.importantDates,
    this.ageLimit,
    this.qualification = const [],
    this.vacancies,
    this.applicationFees,
    this.selectionProcess = const [],
    this.salary,
    this.howToApply,
  });

  factory ImportantPoints.fromJson(Map<String, dynamic> json) {
    return ImportantPoints(
      eligibility: json['eligibility'] != null
          ? List<String>.from(json['eligibility'])
          : [],
      importantDates: ImportantDates.fromJson(json['importantDates'] ?? {}),
      ageLimit:
          json['ageLimit'] != null ? AgeLimit.fromJson(json['ageLimit']) : null,
      qualification: json['qualification'] != null
          ? List<String>.from(json['qualification'])
          : [],
      vacancies: json['vacancies'] != null
          ? Vacancies.fromJson(json['vacancies'])
          : null,
      applicationFees: json['applicationFees'] != null
          ? ApplicationFees.fromJson(json['applicationFees'])
          : null,
      selectionProcess: json['selectionProcess'] != null
          ? List<String>.from(json['selectionProcess'])
          : [],
      salary: json['salary'],
      howToApply: json['howToApply'],
    );
  }
}

/// Important dates for the job
class ImportantDates {
  final DateTime? applicationStart;
  final DateTime? applicationEnd;
  final DateTime? examDate;
  final DateTime? resultDate;

  ImportantDates({
    this.applicationStart,
    this.applicationEnd,
    this.examDate,
    this.resultDate,
  });

  factory ImportantDates.fromJson(Map<String, dynamic> json) {
    return ImportantDates(
      applicationStart: json['applicationStart'] != null
          ? DateTime.parse(json['applicationStart'])
          : null,
      applicationEnd: json['applicationEnd'] != null
          ? DateTime.parse(json['applicationEnd'])
          : null,
      examDate:
          json['examDate'] != null ? DateTime.parse(json['examDate']) : null,
      resultDate: json['resultDate'] != null
          ? DateTime.parse(json['resultDate'])
          : null,
    );
  }
}

/// Age limit information
class AgeLimit {
  final int? min;
  final int? max;
  final String? relaxation;

  AgeLimit({this.min, this.max, this.relaxation});

  factory AgeLimit.fromJson(Map<String, dynamic> json) {
    return AgeLimit(
      min: json['min'],
      max: json['max'],
      relaxation: json['relaxation'],
    );
  }
}

/// Vacancy details by category
class Vacancies {
  final int total;
  final VacancyCategory category;

  Vacancies({required this.total, required this.category});

  factory Vacancies.fromJson(Map<String, dynamic> json) {
    return Vacancies(
      total: json['total'] ?? 0,
      category: VacancyCategory.fromJson(json['category'] ?? {}),
    );
  }
}

class VacancyCategory {
  final int ur;
  final int obc;
  final int sc;
  final int st;
  final int ews;

  VacancyCategory({
    this.ur = 0,
    this.obc = 0,
    this.sc = 0,
    this.st = 0,
    this.ews = 0,
  });

  factory VacancyCategory.fromJson(Map<String, dynamic> json) {
    return VacancyCategory(
      ur: json['UR'] ?? 0,
      obc: json['OBC'] ?? 0,
      sc: json['SC'] ?? 0,
      st: json['ST'] ?? 0,
      ews: json['EWS'] ?? 0,
    );
  }
}

/// Application fees information
class ApplicationFees {
  final int? general;
  final int? obc;
  final int? scst;
  final int? female;

  ApplicationFees({this.general, this.obc, this.scst, this.female});

  factory ApplicationFees.fromJson(Map<String, dynamic> json) {
    return ApplicationFees(
      general: json['general'],
      obc: json['obc'],
      scst: json['scst'],
      female: json['female'],
    );
  }
}

/// YouTube video resource
class YouTubeVideo {
  final String videoId;
  final String title;
  final String channelName;
  final String thumbnail;
  final DateTime publishedAt;
  final int viewCount;

  YouTubeVideo({
    required this.videoId,
    required this.title,
    required this.channelName,
    required this.thumbnail,
    required this.publishedAt,
    this.viewCount = 0,
  });

  factory YouTubeVideo.fromJson(Map<String, dynamic> json) {
    return YouTubeVideo(
      videoId: json['videoId'] ?? '',
      title: json['title'] ?? '',
      channelName: json['channelName'] ?? '',
      thumbnail: json['thumbnail'] ?? '',
      publishedAt: DateTime.parse(json['publishedAt']),
      viewCount: json['viewCount'] ?? 0,
    );
  }

  String get videoUrl => 'https://www.youtube.com/watch?v=$videoId';
}
