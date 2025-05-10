
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import TechIcons from '../components/TechIcons';

type StatItem = {
  number: string;
  label: string;
};

type TeamMember = {
  name: string;
  title: string;
  image: string;
};

type AboutContent = {
  id: number;
  title: string;
  subtitle: string;
  vision: string | null;
  mission: string | null;
  team_title: string;
  stats: StatItem[];
  team_members: TeamMember[];
  cover_image: string | null;
  updated_at: string | null;
};

const About = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        // Parse JSON fields to ensure they match our types
        const parsedContent: AboutContent = {
          ...data,
          stats: Array.isArray(data.stats) 
            ? data.stats.map((item: any): StatItem => ({
                number: String(item.number || '0'),
                label: String(item.label || '')
              })) 
            : [],
          team_members: Array.isArray(data.team_members) 
            ? data.team_members.map((item: any): TeamMember => ({
                name: String(item.name || ''),
                title: String(item.title || ''),
                image: String(item.image || '')
              })) 
            : []
        };

        setContent(parsedContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="pt-32 pb-16 bg-trndsky-darkblue text-white bg-cover bg-center"
        style={{
          backgroundImage: content?.cover_image 
            ? `linear-gradient(rgba(7, 25, 77, 0.9), rgba(7, 25, 77, 0.85)), url(${content.cover_image})` 
            : 'none'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-tajawal">
            {loading ? <Skeleton className="h-12 w-2/3 mx-auto" /> : content?.title}
          </h1>
          <p className="text-xl max-w-3xl mx-auto font-tajawal">
            {loading ? <Skeleton className="h-6 w-full mx-auto mt-4" /> : content?.subtitle}
          </p>
        </div>
      </div>
      
      <main className="flex-grow bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">
                رؤيتنا
              </h2>
              <p className="text-gray-700 leading-relaxed font-tajawal">
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </>
                ) : content?.vision}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-trndsky-darkblue font-tajawal">
                رسالتنا
              </h2>
              <p className="text-gray-700 leading-relaxed font-tajawal">
                {loading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </>
                ) : content?.mission}
              </p>
            </div>
          </div>

          {/* Statistics */}
          {content?.stats && content.stats.length > 0 && (
            <div className="bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue py-16 rounded-xl mb-16">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {content.stats.map((stat, index) => (
                    <div key={index} className="text-center text-white">
                      <div className="text-5xl font-bold mb-2 font-tajawal">{stat.number}</div>
                      <div className="text-xl font-tajawal opacity-90">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Services/Technologies */}
          <TechIcons />

          {/* Team Members */}
          {content?.team_members && content.team_members.length > 0 && (
            <div className="py-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-trndsky-darkblue font-tajawal">
                {content?.team_title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.team_members.map((member, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2 text-trndsky-teal font-tajawal">{member.name}</h3>
                      <p className="text-gray-600 font-tajawal">{member.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
