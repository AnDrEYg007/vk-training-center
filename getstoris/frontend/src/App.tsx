import React, { useState } from 'react'
import { LoginPage } from './LoginPage';

interface VKGroup {
  id: number;
  name: string;
  photo_100?: string;
  is_admin: boolean;
}

const BACKEND_URL = 'http://127.0.0.1:8000';

const jsonp = (url: string, callbackName: string = 'callback') => {
  return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const name = `jsonp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Cleanup function
      const cleanup = () => {
          if ( script.parentNode ) script.parentNode.removeChild(script);
          delete (window as any)[name];
      };

      (window as any)[name] = (data: any) => {
          cleanup();
          resolve(data);
      };

      script.src = `${url}&${callbackName}=${name}`;
      script.onerror = () => {
          cleanup();
          reject(new Error('JSONP request failed'));
      };

      document.head.appendChild(script);
  });
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]); // List of all users from DB
  const [groups, setGroups] = useState<VKGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all users on mount
  React.useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`);
      if (res.ok) {
        setAllUsers(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch users list", e);
    }
  };

  const handleLogin = async (vkData: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🚀 Sending auth request to: ${BACKEND_URL}/api/auth/vk`);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/vk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vkData),
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error("Backend error (but continuing flow if 400):", text);
        // Continue flow even if backend "warns" about IP
      } else {
        const userData = await response.json();
        setUser(userData); // Set simplified user
      }

      // 🚀 FETCH GROUPS FROM CLIENT (Directly from VK, avoiding IP mismatch on backend)
      // access_token is in vkData.access_token
      await fetchGroupsDirectly(vkData.access_token, vkData.user_id);
      
      fetchAllUsers(); // Refresh list

    } catch (err: any) {
      console.error("❌ Login flow failed:", err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupsDirectly = async (token: string, userId: number) => {
      try {
           console.log("🌍 Fetching groups from Client Side via JSONP...");
           const response: any = await jsonp(`https://api.vk.com/method/groups.get?user_id=${userId}&extended=1&filter=admin,editor,moderator&fields=photo_100,is_admin&access_token=${token}&v=5.199`);
           
           if (response.error) {
               throw new Error(response.error.error_msg);
           }
           
           const items = response.response.items || [];
           console.log("✅ Groups received:", items);
           setGroups(items.map((g: any) => ({
             id: g.id,
             name: g.name,
             photo_100: g.photo_100,
             is_admin: g.is_admin == 1
           })));
           
           // If user didn't get set from backend (e.g. error), set it partially here so UI unlocks
           setUser((prev: any) => prev || { 
               id: userId, 
               first_name: "VK User", 
               last_name: String(userId),
               avatar: "" // Could fetch from users.get similarly 
           });

      } catch (e: any) {
          console.error("Failed to fetch groups client-side", e);
          setError("Failed to load groups: " + e.message);
      }
  };

  const fetchGroups = async (userId: number) => {
    console.log("Groups refreshing is only available via re-login in this dev mode due to token security.");
    alert("To refresh groups, please logout and login again.");
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
         <svg style={{ animation: 'spin 1s linear infinite', width: 24, height: 24, marginRight: 8 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2A10 10 0 1022 12A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" opacity="0.25" />
            <path fill="currentColor" d="M12 4a8 8 0 017.846 6.27c.09.825-1.127.94-1.25.148A6.095 6.095 0 0012 5.92c-.066 0-.132.003-.197.008a.998.998 0 01-.01-1.996A8.006 8.006 0 0112 4z" />
         </svg>
         Авторизация...
         <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {error && (
            <div style={{ position: 'fixed', top: 20, right: 20, background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                {error}
            </div>
        )}
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.avatar ? 
              <img src={user.avatar} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> :
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e5e7eb' }}></div>
            }
            <div>
               <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{user.first_name} {user.last_name}</h2>
               <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ID: {user.vk_id}</span>
            </div>
         </div>
         <button className="btn btn-secondary" onClick={() => window.location.reload()}>Выйти</button>
      </header>
      
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Ваши сообщества</h3>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: 999 }}>
            {groups.length}
          </span>
        </div>

        {groups.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
              Нет доступных сообществ или список загружается...
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {groups.map(group => (
              <div key={group.id} style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  background: 'white',
                  transition: 'box-shadow 0.2s',
                  cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <img src={group.photo_100 || 'https://vk.com/images/community_100.png'} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</div>
                  <div style={{ fontSize: '0.75rem', color: group.is_admin ? '#059669' : '#6b7280' }}>
                    {group.is_admin ? 'Администратор' : 'Модератор'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App
