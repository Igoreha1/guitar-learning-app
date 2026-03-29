export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-widgets">
          <div>
            <h4>О проекте</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#95a5a6' }}>
              GuitarSync - бесплатный самоучитель игры на гитаре. Разборы песен, уроки для начинающих, метроном и другие полезные инструменты.
            </p>
          </div>
          
          <div>
            <h4>Рубрики</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Разборы песен</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Уроки для начинающих</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Виды боя</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Аккорды</a></li>
            </ul>
          </div>
          
          <div>
            <h4>Инструменты</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="/metronome" style={{ color: '#95a5a6', textDecoration: 'none' }}>Метроном онлайн</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Тюнер</a></li>
              <li style={{ marginBottom: '8px' }}><a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Аккорды для песен</a></li>
            </ul>
          </div>
          
          <div>
            <h4>Контакты</h4>
            <p style={{ fontSize: '14px', color: '#95a5a6' }}>
              По вопросам: info@guitarsync.ru
            </p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>Telegram</a>
              <a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>VK</a>
              <a href="#" style={{ color: '#95a5a6', textDecoration: 'none' }}>YouTube</a>
            </div>
          </div>
        </div>
        
        <div className="footer-copy">
          <p>© 2024 GuitarSync. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}