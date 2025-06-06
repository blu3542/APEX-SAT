import React from "react";
import { GraduationCap, BookOpen, Target, Award } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 text-blue-800 mx-auto mb-6" />
            <h1 className="text-5xl font-extrabold text-blue-900 mb-6">
              Welcome to Apex Academy
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your premier destination for SAT preparation. Experience adaptive
              learning with expertly crafted question sets and receive
              personalized feedback from our professional tutors.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Adaptive Learning
              </h3>
              <p className="text-gray-600">
                Question sets that evolve with your progress, focusing on areas
                that need improvement.
              </p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Expert Review
              </h3>
              <p className="text-gray-600">
                Professional tutors analyze your answers and provide targeted
                feedback for improvement.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Proven Results
              </h3>
              <p className="text-gray-600">
                Our structured approach has helped thousands of students achieve
                their target scores.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Student Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                score: "1580",
                quote:
                  "Apex Academy's adaptive learning system helped me focus on my weak areas and achieve my dream score.",
              },
              {
                name: "James Wilson",
                score: "1550",
                quote:
                  "The personalized feedback from tutors made all the difference in my SAT preparation journey.",
              },
              {
                name: "Maria Garcia",
                score: "1520",
                quote:
                  "I improved my score by 200 points thanks to Apex Academy's structured approach.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold">
                      {testimonial.score}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">SAT Score</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="h-10 w-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Apex Academy</h2>
          <p className="text-blue-200">
            Empowering students to reach their full potential
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
