// app/careers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Coffee,
  Home,
  GraduationCap,
  Globe,
  Users,
  Zap,
  Gift,
  Calendar,
  Smartphone,
  Laptop,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Star,
  Award,
  BookOpen,
  Plane,
  Music,
  Utensils,
  Shield,
  Target,
  Eye,
  Sparkles,
  Rocket,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Smile
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CareersPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Job listings
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '5+ years',
      salary: 'KES 150,000 - 250,000',
      posted: '2 days ago',
      description: 'We are looking for a passionate Senior Frontend Developer to lead our web development team. You will be responsible for building beautiful, responsive, and performant user interfaces.',
      responsibilities: [
        'Lead frontend development for our main marketplace platform',
        'Mentor junior developers and conduct code reviews',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with UX/UI designers to implement designs',
        'Stay updated with emerging technologies and industry trends'
      ],
      requirements: [
        '5+ years of experience with React.js and Next.js',
        'Strong understanding of TypeScript, Tailwind CSS',
        'Experience with state management (Redux, Zustand)',
        'Knowledge of modern frontend build pipelines',
        'Excellent problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary', 'Health insurance', 'Flexible hours',
        'Remote work options', 'Professional development budget'
      ]
    },
    {
      id: '2',
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '3+ years',
      salary: 'KES 120,000 - 200,000',
      posted: '1 week ago',
      description: 'Join our backend team to build scalable APIs and microservices that power our e-commerce platform.',
      responsibilities: [
        'Design and implement scalable backend services',
        'Optimize database queries and system performance',
        'Ensure high availability and security of services',
        'Collaborate with frontend team on API design',
        'Write comprehensive documentation'
      ],
      requirements: [
        '3+ years experience with Node.js/Python',
        'Experience with PostgreSQL, MongoDB',
        'Knowledge of RESTful APIs and microservices',
        'Understanding of cloud services (AWS/GCP)',
        'Strong problem-solving skills'
      ],
      benefits: [
        'Competitive salary', 'Stock options', 'Learning stipend',
        'Gym membership', 'Team retreats'
      ]
    },
    {
      id: '3',
      title: 'Product Manager',
      department: 'Product',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '4+ years',
      salary: 'KES 180,000 - 280,000',
      posted: '3 days ago',
      description: 'Lead product development for our vendor platform, working with cross-functional teams to deliver exceptional experiences.',
      responsibilities: [
        'Define product vision and roadmap',
        'Gather and prioritize requirements',
        'Work with engineering and design teams',
        'Analyze metrics and user feedback',
        'Coordinate product launches'
      ],
      requirements: [
        '4+ years product management experience',
        'Experience with e-commerce platforms',
        'Strong analytical and communication skills',
        'Knowledge of agile methodologies',
        'Customer-first mindset'
      ],
      benefits: [
        'Leadership role', 'Performance bonus', 'Health coverage',
        'Flexible schedule', 'Annual retreat'
      ]
    },
    {
      id: '4',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      salary: 'KES 100,000 - 180,000',
      posted: '5 days ago',
      description: 'Create beautiful, intuitive designs that delight our users and enhance the shopping experience.',
      responsibilities: [
        'Create user flows, wireframes, and prototypes',
        'Design responsive web and mobile interfaces',
        'Conduct user research and usability testing',
        'Maintain design systems',
        'Collaborate with developers on implementation'
      ],
      requirements: [
        '3+ years UI/UX design experience',
        'Proficiency with Figma, Adobe XD',
        'Strong portfolio demonstrating design thinking',
        'Understanding of HTML/CSS basics',
        'Excellent visual design skills'
      ],
      benefits: [
        'Creative freedom', 'Design tools budget', 'Remote work',
        'Flexible hours', 'Learning resources'
      ]
    },
    {
      id: '5',
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '4+ years',
      salary: 'KES 130,000 - 220,000',
      posted: '1 week ago',
      description: 'Lead our marketing efforts to grow our user base and strengthen our brand presence.',
      responsibilities: [
        'Develop and execute marketing strategies',
        'Manage digital marketing campaigns',
        'Analyze campaign performance metrics',
        'Build brand awareness and loyalty',
        'Lead and mentor marketing team'
      ],
      requirements: [
        '4+ years marketing experience',
        'Experience with digital marketing channels',
        'Strong analytical and creative skills',
        'Knowledge of SEO/SEM',
        'Excellent communication skills'
      ],
      benefits: [
        'Marketing budget', 'Performance bonuses', 'Health insurance',
        'Flexible schedule', 'Career growth opportunities'
      ]
    },
    {
      id: '6',
      title: 'Customer Support Specialist',
      department: 'Support',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '1+ years',
      salary: 'KES 40,000 - 60,000',
      posted: '2 days ago',
      description: 'Help our customers get the best experience by providing exceptional support and problem-solving.',
      responsibilities: [
        'Respond to customer inquiries via chat, email, phone',
        'Resolve issues and escalate when needed',
        'Maintain customer satisfaction metrics',
        'Document common issues and solutions',
        'Provide feedback to improve processes'
      ],
      requirements: [
        '1+ years customer service experience',
        'Excellent communication skills',
        'Problem-solving mindset',
        'Patience and empathy',
        'Tech-savvy'
      ],
      benefits: [
        'Training provided', 'Health insurance', 'Shift allowances',
        'Growth opportunities', 'Team activities'
      ]
    },
    {
      id: '7',
      title: 'Data Analyst',
      department: 'Data',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      salary: 'KES 80,000 - 150,000',
      posted: '4 days ago',
      description: 'Turn data into insights that drive business decisions and improve user experience.',
      responsibilities: [
        'Analyze business metrics and user behavior',
        'Create dashboards and reports',
        'Identify trends and opportunities',
        'Work with stakeholders on data needs',
        'Maintain data quality and accuracy'
      ],
      requirements: [
        '2+ years data analysis experience',
        'Proficiency in SQL, Python/R',
        'Experience with visualization tools (Tableau, PowerBI)',
        'Strong analytical thinking',
        'Business acumen'
      ],
      benefits: [
        'Remote work', 'Flexible hours', 'Learning budget',
        'Health insurance', 'Performance bonuses'
      ]
    },
    {
      id: '8',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Nairobi',
      type: 'Full-time',
      experience: '3+ years',
      salary: 'KES 150,000 - 250,000',
      posted: '1 week ago',
      description: 'Build and maintain our cloud infrastructure, ensuring high availability and scalability.',
      responsibilities: [
        'Manage cloud infrastructure (AWS/GCP)',
        'Implement CI/CD pipelines',
        'Monitor system performance and reliability',
        'Automate deployment processes',
        'Ensure security best practices'
      ],
      requirements: [
        '3+ years DevOps experience',
        'Experience with Kubernetes, Docker',
        'Knowledge of AWS/GCP services',
        'Infrastructure as Code (Terraform)',
        'Strong scripting skills'
      ],
      benefits: [
        'Competitive salary', 'Stock options', 'Health coverage',
        'Remote work options', 'Conference budget'
      ]
    }
  ];

  // Departments for filtering
  const departments = ['all', 'Engineering', 'Product', 'Design', 'Marketing', 'Support', 'Data'];
  
  // Locations for filtering
  const locations = ['all', 'Nairobi', 'Remote'];

  // Company Benefits
  const benefits = [
    { icon: <Heart className="w-6 h-6" />, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and your family' },
    { icon: <Home className="w-6 h-6" />, title: 'Remote Work', description: 'Work from anywhere with our flexible remote policy' },
    { icon: <Clock className="w-6 h-6" />, title: 'Flexible Hours', description: 'Choose your work schedule to fit your lifestyle' },
    { icon: <GraduationCap className="w-6 h-6" />, title: 'Learning Budget', description: 'Annual stipend for courses, books, and conferences' },
    { icon: <Gift className="w-6 h-6" />, title: 'Performance Bonus', description: 'Quarterly bonuses based on team and individual performance' },
    { icon: <Coffee className="w-6 h-6" />, title: 'Wellness Stipend', description: 'Monthly allowance for gym, meditation, or wellness activities' },
    { icon: <Calendar className="w-6 h-6" />, title: 'Paid Time Off', description: '25 days of vacation plus public holidays' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Stock Options', description: 'Share in our success with employee stock options' }
  ];

  // Company Culture Highlights
  const cultureHighlights = [
    { icon: <Users className="w-6 h-6" />, title: 'Collaborative Environment', description: 'Work with talented, supportive teammates who love what they do' },
    { icon: <Rocket className="w-6 h-6" />, title: 'Fast-Paced Growth', description: 'Opportunities to learn, grow, and take on new challenges' },
    { icon: <Zap className="w-6 h-6" />, title: 'Innovation First', description: 'We embrace new ideas and technologies' },
    { icon: <Globe className="w-6 h-6" />, title: 'Diverse & Inclusive', description: 'A workplace where everyone feels welcome and valued' }
  ];

  // Company Values
  const companyValues = [
    { icon: <Heart className="w-5 h-5" />, name: 'Customer First' },
    { icon: <Shield className="w-5 h-5" />, name: 'Integrity' },
    { icon: <Zap className="w-5 h-5" />, name: 'Innovation' },
    { icon: <Users className="w-5 h-5" />, name: 'Teamwork' },
    { icon: <Target className="w-5 h-5" />, name: 'Excellence' },
    { icon: <Smile className="w-5 h-5" />, name: 'Empathy' }
  ];

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesLocation && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary-soft)]/5 to-transparent py-20 md:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary-alt)]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-2xl mb-6 animate-bounce-subtle">
              <Briefcase className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text)] mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8 leading-relaxed">
              Build the future of e-commerce in Kenya. Work with passionate people who are making a difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#open-positions"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all hover:scale-105"
              >
                View Open Positions
              </Link>
              <Link
                href="#culture"
                className="px-6 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-semibold hover:border-[var(--color-primary)] transition-all"
              >
                Learn About Our Culture
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Join Us Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Why Join Shaddyna?</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            We're building something special, and we want you to be part of it
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureHighlights.map((highlight, idx) => (
              <div key={idx} className="group bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-xl text-center">
                <div className="inline-flex p-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-xl mb-4 text-white group-hover:scale-110 transition-transform">
                  {highlight.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{highlight.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary-alt)]/5 rounded-2xl p-8 border border-[var(--color-border)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Our Values</h2>
            <p className="text-[var(--color-text-muted)]">What we believe in and how we work</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {companyValues.map((value, idx) => (
              <div key={idx} className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)]">
                <span className="text-[var(--color-primary)]">{value.icon}</span>
                <span className="text-sm text-[var(--color-text)]">{value.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Benefits & Perks</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            We take care of our team so you can focus on doing your best work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1">{benefit.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div id="open-positions" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Open Positions</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
            Join our team and help shape the future of e-commerce in Kenya
          </p>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search jobs by title, department, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>
              
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters */}
              <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-3`}>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedDepartment !== 'all' || selectedLocation !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedDepartment !== 'all' && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm">
                    <span>Department: {selectedDepartment}</span>
                    <button onClick={() => setSelectedDepartment('all')} className="hover:text-red-500">×</button>
                  </span>
                )}
                {selectedLocation !== 'all' && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm">
                    <span>Location: {selectedLocation}</span>
                    <button onClick={() => setSelectedLocation('all')} className="hover:text-red-500">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm">
                    <span>Search: {searchQuery}</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Job Listings */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 mb-3">
                          <span className="inline-flex items-center space-x-1 text-sm text-[var(--color-text-muted)]">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.department}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 text-sm text-[var(--color-text-muted)]">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 text-sm text-[var(--color-text-muted)]">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 text-sm text-[var(--color-text-muted)]">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </span>
                        </div>
                        <p className="text-[var(--color-text-muted)] mb-4">{job.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-[var(--color-text-muted)]">📅 Posted {job.posted}</span>
                          <span className="text-[var(--color-text-muted)]">🎓 {job.experience}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        className="flex items-center space-x-2 px-4 py-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                      >
                        <span>{expandedJob === job.id ? 'Show Less' : 'View Details'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedJob === job.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-background-soft)] animate-slide-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)] mb-3">Responsibilities</h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-[var(--color-text-muted)]">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--color-text)] mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-[var(--color-text-muted)]">
                                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                        <h4 className="font-semibold text-[var(--color-text)] mb-3">What We Offer</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <Link
                          href={`/careers/apply/${job.id}`}
                          className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-all hover:scale-105"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-[var(--color-primary)]/10 rounded-full mb-4">
                <Search className="w-12 h-12 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No positions found</h3>
              <p className="text-[var(--color-text-muted)]">
                We don't have any open positions matching your criteria. Check back soon!
              </p>
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Culture Gallery Placeholder */}
        <div id="culture" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4 text-center">Life at Shaddyna</h2>
          <p className="text-center text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto">
            We work hard, celebrate wins, and grow together
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-alt)]/20 rounded-xl flex items-center justify-center border border-[var(--color-border)]"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-xs text-[var(--color-text-muted)]">Team Fun</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Don't See a Role? */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-alt)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll reach out when a position opens up.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/careers/speculative"
              className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
            >
              Send Speculative Application
            </Link>
            <a
              href="mailto:careers@shaddyna.com"
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              careers@shaddyna.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;