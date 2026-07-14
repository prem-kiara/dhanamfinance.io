/* ==============================================================
   DHANAM — DISCLAIMER POPUP
   --------------------------------------------------------------
   Auto-opens once per browser session (tracked via sessionStorage).
   Re-shows after the tab/window is closed and the site is launched
   again. Internal navigation does NOT re-trigger it. Contains
   CAUTION / DISCLAIMER / GENERAL DISCLAIMER sections in English,
   Tamil, Malayalam, and Hindi. Self-contained: injects its own
   CSS + DOM, no deps.
   ============================================================== */

(function () {
  'use strict';

  // -----------------------------------------------------------
  // TEXT CONTENT (EN / TA / ML)
  // -----------------------------------------------------------
  var CONTENT = {
    en: {
      langLabel: 'English',
      closeLabel: 'Close',
      understood: 'I Understand',
      sections: [
        {
          heading: 'CAUTION',
          body: 'Dhanam Investment and Finance Private Limited (<strong>"Dhanam"</strong> or <strong>"the Company"</strong>) offers its official mobile application, <strong>Dhanamfin</strong>, on the Google Play Store and the Apple App Store. Any other mobile application, website, or service claiming to be from Dhanam (or its predecessor, Kiara Microcredit Private Limited) is fraudulent. Members of the public are cautioned to beware of such impersonators that misuse our name, logo, or identity to solicit loans, collect personal information, or obtain payments.<br><br><strong>Dhanam does not charge any customer, in any form, in exchange for granting or approving a loan.</strong> Any person or application demanding an upfront payment, &ldquo;processing&rdquo; money, deposit, or similar amount as a condition for approving or releasing a loan is not acting on behalf of Dhanam and should be reported immediately.'
        },
        {
          heading: 'DISCLAIMER',
          body: 'Dhanam shall not be liable, in any manner whatsoever, for any loss, damage, consequence, or claim suffered by any person who acts upon, or falls victim to, any such fraudulent digital lending application or impersonator. Dhanam shall also bear no responsibility for any loss, damage, or harm arising out of the products, services, advice, or communications of any third party, whether or not such third party is represented as being associated with the Company.'
        },
        {
          heading: 'GENERAL DISCLAIMER',
          body: 'The information, materials, advice, suggestions, illustrations, notifications, circulars, and other communications made available on this website (collectively, <strong>"the Content"</strong>) are published for general informational purposes only. Dhanam disclaims any liability for errors or omissions in the Content and does not accept any legal liability on the basis of the Content. Dhanam reserves the right, at its sole discretion, to modify, update, or remove any part of the Content without prior notice. No part of the Content may be reproduced, displayed, distributed, or printed, in whole or in part, in any form or medium, without the prior written consent of Dhanam Investment and Finance Private Limited.'
        }
      ]
    },
    ta: {
      langLabel: 'தமிழ்',
      closeLabel: 'மூடு',
      understood: 'புரிந்துகொண்டேன்',
      sections: [
        {
          heading: 'எச்சரிக்கை',
          body: 'தனம் இன்வெஸ்ட்மெண்ட் அண்ட் ஃபைனான்ஸ் பிரைவேட் லிமிடெட் (<strong>"தனம்"</strong> அல்லது <strong>"நிறுவனம்"</strong>) தனது அதிகாரப்பூர்வ மொபைல் பயன்பாட்டை (<strong>Dhanamfin</strong>) Google Play Store மற்றும் Apple App Store-ல் வழங்குகிறது. தனம் (அல்லது அதன் முன்னாள் நிறுவனமான கியாரா மைக்ரோகிரெடிட் பிரைவேட் லிமிடெட்) என்று கூறும் வேறு எந்தவொரு மொபைல் பயன்பாடு, இணையதளம் அல்லது சேவையும் மோசடியானது. எங்கள் பெயர், சின்னம் அல்லது அடையாளத்தைத் தவறாகப் பயன்படுத்தி கடன் பெற, தனிப்பட்ட தகவல்களைச் சேகரிக்க அல்லது பணம் பெற முயலும் இத்தகைய போலி நபர்கள் குறித்து பொதுமக்கள் எச்சரிக்கையாக இருக்க வேண்டும்.<br><br><strong>கடனை வழங்குவதற்கு அல்லது அனுமதிப்பதற்கு ஈடாக தனம் எந்தவொரு வாடிக்கையாளரிடமிருந்தும் எந்த வடிவத்திலும் பணம் வசூலிக்காது.</strong> கடனை அனுமதிப்பதற்கு அல்லது வழங்குவதற்கு நிபந்தனையாக முன்கூட்டிய பணம், &ldquo;செயலாக்கக்&rdquo; கட்டணம், வைப்புத்தொகை அல்லது அதுபோன்ற எந்தத் தொகையையும் கோரும் எந்த நபரும் பயன்பாடும் தனம் சார்பில் செயல்படவில்லை; அத்தகைய முயற்சிகளை உடனடியாகப் புகாரளிக்க வேண்டும்.'
        },
        {
          heading: 'மறுப்பு',
          body: 'இத்தகைய மோசடியான டிஜிட்டல் கடன் வழங்கும் பயன்பாடு அல்லது போலி நபரை நம்பி செயல்பட்டு அல்லது அதற்கு பலியாகும் எந்த நபருக்கும் ஏற்படும் இழப்பு, சேதம், விளைவு அல்லது கோரிக்கைக்கு தனம் எந்த வகையிலும் பொறுப்பாகாது. எந்தவொரு மூன்றாம் தரப்பினரின் பொருட்கள், சேவைகள், ஆலோசனைகள் அல்லது தகவல் தொடர்புகளால் ஏற்படும் எந்த இழப்பு, சேதம் அல்லது தீங்குக்கும், அந்த மூன்றாம் தரப்பினர் நிறுவனத்துடன் தொடர்புடையவர்களாக குறிப்பிடப்பட்டாலும் இல்லாவிட்டாலும், தனம் எந்த பொறுப்பும் ஏற்காது.'
        },
        {
          heading: 'பொது மறுப்பு',
          body: 'இந்த இணையதளத்தில் வழங்கப்படும் தகவல்கள், பொருட்கள், ஆலோசனைகள், பரிந்துரைகள், விளக்கப்படங்கள், அறிவிப்புகள், சுற்றறிக்கைகள் மற்றும் பிற தகவல் தொடர்புகள் (கூட்டாக <strong>"உள்ளடக்கம்"</strong> என அழைக்கப்படுபவை) பொது தகவல் நோக்கங்களுக்காக மட்டுமே வெளியிடப்படுகின்றன. உள்ளடக்கத்தில் உள்ள பிழைகள் அல்லது விடுபடல்களுக்கு தனம் எந்தப் பொறுப்பும் ஏற்காது, மேலும் உள்ளடக்கத்தின் அடிப்படையில் எந்தச் சட்டப்பூர்வப் பொறுப்பையும் ஏற்றுக்கொள்ளாது. உள்ளடக்கத்தின் எந்தப் பகுதியையும் முன்னறிவிப்பின்றி திருத்தவும், புதுப்பிக்கவும் அல்லது அகற்றவும் தனம் தனது சொந்த விருப்பத்தின் அடிப்படையில் உரிமையை வைத்துள்ளது. தனம் இன்வெஸ்ட்மெண்ட் அண்ட் ஃபைனான்ஸ் பிரைவேட் லிமிடெட்டின் முன் எழுத்துப்பூர்வ அனுமதி இல்லாமல், உள்ளடக்கத்தின் எந்தப் பகுதியையும் முழுவதுமாகவோ பகுதியாகவோ, எந்த வடிவிலும் அல்லது ஊடகத்திலும், மீண்டும் உருவாக்கவோ, காட்சிப்படுத்தவோ, விநியோகிக்கவோ அல்லது அச்சிடவோ கூடாது.'
        }
      ]
    },
    ml: {
      langLabel: 'മലയാളം',
      closeLabel: 'അടയ്ക്കുക',
      understood: 'മനസ്സിലായി',
      sections: [
        {
          heading: 'മുന്നറിയിപ്പ്',
          body: 'ധനം ഇൻവെസ്റ്റ്‌മെന്റ് ആൻഡ് ഫിനാൻസ് പ്രൈവറ്റ് ലിമിറ്റഡ് (<strong>"ധനം"</strong> അല്ലെങ്കിൽ <strong>"കമ്പനി"</strong>) അതിന്റെ ഔദ്യോഗിക മൊബൈൽ ആപ്ലിക്കേഷൻ (<strong>Dhanamfin</strong>) Google Play Store-ലും Apple App Store-ലും ലഭ്യമാക്കുന്നു. ധനം (അല്ലെങ്കിൽ അതിന്റെ മുൻഗാമിയായ കിയാര മൈക്രോക്രെഡിറ്റ് പ്രൈവറ്റ് ലിമിറ്റഡ്) എന്ന് അവകാശപ്പെടുന്ന മറ്റേതൊരു മൊബൈൽ ആപ്ലിക്കേഷനും വെബ്‌സൈറ്റും സേവനവും വ്യാജമാണ്. ഞങ്ങളുടെ പേര്, ലോഗോ അല്ലെങ്കിൽ ഐഡന്റിറ്റി ദുരുപയോഗം ചെയ്ത് വായ്പ അഭ്യർത്ഥിക്കാനും വ്യക്തിഗത വിവരങ്ങൾ ശേഖരിക്കാനും പണം നേടാനും ശ്രമിക്കുന്ന അത്തരം ആൾമാറാട്ടക്കാരെ കുറിച്ച് പൊതുജനങ്ങൾ ജാഗ്രത പാലിക്കണം.<br><br><strong>വായ്പ അനുവദിക്കുന്നതിനോ അംഗീകരിക്കുന്നതിനോ പകരമായി ധനം ഏതൊരു ഉപഭോക്താവിൽ നിന്നും ഏതെങ്കിലും രൂപത്തിൽ പണം ഈടാക്കില്ല.</strong> വായ്പ അനുവദിക്കാനോ നൽകാനോ ഉള്ള വ്യവസ്ഥയായി മുൻകൂർ പണം, &ldquo;പ്രോസസ്സിംഗ്&rdquo; ഫീസ്, നിക്ഷേപം അല്ലെങ്കിൽ സമാനമായ തുക ആവശ്യപ്പെടുന്ന ഏതൊരു വ്യക്തിയും ആപ്ലിക്കേഷനും ധനത്തിനുവേണ്ടി പ്രവർത്തിക്കുന്നതല്ല; അത്തരം അഭ്യർത്ഥനകൾ ഉടൻ റിപ്പോർട്ട് ചെയ്യണം.'
        },
        {
          heading: 'നിരാകരണം',
          body: 'അത്തരം വ്യാജ ഡിജിറ്റൽ ലെൻഡിംഗ് ആപ്ലിക്കേഷന്റെയോ ആൾമാറാട്ടക്കാരന്റെയോ അടിസ്ഥാനത്തിൽ പ്രവർത്തിക്കുന്നതോ അതിന് ഇരയാകുന്നതോ ആയ ഏതൊരു വ്യക്തിക്കുമുണ്ടാകുന്ന നഷ്ടം, നാശനഷ്ടം, പരിണതഫലം, ക്ലെയിം എന്നിവയ്ക്ക് ധനം ഒരു വിധത്തിലും ഉത്തരവാദിയായിരിക്കില്ല. ഏതെങ്കിലും മൂന്നാം കക്ഷിയുടെ ഉത്പന്നങ്ങൾ, സേവനങ്ങൾ, ഉപദേശങ്ങൾ അല്ലെങ്കിൽ ആശയവിനിമയങ്ങൾ മൂലമുണ്ടാകുന്ന ഏതൊരു നഷ്ടം, നാശനഷ്ടം അല്ലെങ്കിൽ ദോഷത്തിനും, അത്തരം മൂന്നാം കക്ഷി കമ്പനിയുമായി ബന്ധപ്പെട്ടവരായി പ്രതിനിധീകരിക്കപ്പെട്ടാലും ഇല്ലെങ്കിലും, ധനം ഉത്തരവാദിയായിരിക്കില്ല.'
        },
        {
          heading: 'പൊതു നിരാകരണം',
          body: 'ഈ വെബ്‌സൈറ്റിൽ ലഭ്യമാക്കിയിട്ടുള്ള വിവരങ്ങൾ, ഉള്ളടക്കം, ഉപദേശങ്ങൾ, നിർദ്ദേശങ്ങൾ, ചിത്രീകരണങ്ങൾ, അറിയിപ്പുകൾ, സർക്കുലറുകൾ മറ്റ് ആശയവിനിമയങ്ങൾ (കൂട്ടായി <strong>"ഉള്ളടക്കം"</strong> എന്ന് വിളിക്കപ്പെടുന്നു) പൊതുവായ വിവരദാനത്തിനായി മാത്രമാണ് പ്രസിദ്ധീകരിച്ചിരിക്കുന്നത്. ഉള്ളടക്കത്തിലെ പിശകുകൾക്കോ വിട്ടുപോകലുകൾക്കോ ധനം ഉത്തരവാദിയായിരിക്കില്ല, ഉള്ളടക്കത്തിന്റെ അടിസ്ഥാനത്തിൽ ഒരു നിയമപരമായ ബാധ്യതയും സ്വീകരിക്കുന്നില്ല. ഉള്ളടക്കത്തിന്റെ ഏതു ഭാഗവും മുൻകൂർ അറിയിപ്പില്ലാതെ പരിഷ്കരിക്കാനും അപ്ഡേറ്റ് ചെയ്യാനും നീക്കം ചെയ്യാനും ധനത്തിന് അതിന്റെ പൂർണ്ണ വിവേചനാധികാരത്തിൽ അവകാശമുണ്ട്. ധനം ഇൻവെസ്റ്റ്മെന്റ് ആൻഡ് ഫിനാൻസ് പ്രൈവറ്റ് ലിമിറ്റഡിന്റെ മുൻകൂർ രേഖാമൂലമുള്ള സമ്മതമില്ലാതെ, ഉള്ളടക്കത്തിന്റെ ഒരു ഭാഗവും, മുഴുവനായി അല്ലെങ്കിൽ ഭാഗികമായി, ഏതെങ്കിലും രൂപത്തിലോ മാധ്യമത്തിലോ പുനർനിർമ്മിക്കുകയോ പ്രദർശിപ്പിക്കുകയോ വിതരണം ചെയ്യുകയോ പ്രിന്റ് ചെയ്യുകയോ ചെയ്യാൻ പാടില്ല.'
        }
      ]
    },
    hi: {
      langLabel: 'हिन्दी',
      closeLabel: 'बंद करें',
      understood: 'मैं समझ गया',
      sections: [
        {
          heading: 'सावधान',
          body: 'धनम इन्वेस्टमेंट एंड फाइनेंस प्राइवेट लिमिटेड (<strong>"धनम"</strong> या <strong>"कंपनी"</strong>) अपना आधिकारिक मोबाइल ऐप्लिकेशन (<strong>Dhanamfin</strong>) Google Play Store और Apple App Store पर उपलब्ध कराती है। धनम (या इसकी पूर्ववर्ती कंपनी कियारा माइक्रोक्रेडिट प्राइवेट लिमिटेड) होने का दावा करने वाला कोई भी अन्य मोबाइल ऐप्लिकेशन, वेबसाइट या सेवा धोखाधड़ी है। हमारे नाम, लोगो या पहचान का दुरुपयोग करके ऋण मांगने, व्यक्तिगत जानकारी एकत्र करने या भुगतान प्राप्त करने का प्रयास करने वाले ऐसे धोखेबाज़ों से आम जनता को सावधान रहना चाहिए।<br><br><strong>ऋण स्वीकृत करने या देने के बदले में धनम किसी भी ग्राहक से, किसी भी रूप में, कोई शुल्क नहीं लेती है।</strong> ऋण स्वीकृति या वितरण की शर्त के रूप में अग्रिम भुगतान, &ldquo;प्रोसेसिंग&rdquo; शुल्क, जमा राशि या समान कोई भी राशि मांगने वाला कोई भी व्यक्ति या ऐप्लिकेशन धनम की ओर से कार्य नहीं कर रहा है; ऐसे अनुरोधों की तुरंत शिकायत की जानी चाहिए।'
        },
        {
          heading: 'अस्वीकरण',
          body: 'ऐसे किसी भी धोखाधड़ी वाले डिजिटल ऋण ऐप्लिकेशन या प्रतिरूपणकर्ता पर विश्वास करके कार्य करने वाले या उसका शिकार होने वाले किसी भी व्यक्ति को होने वाली किसी भी हानि, क्षति, परिणाम या दावे के लिए धनम किसी भी प्रकार से उत्तरदायी नहीं होगी। किसी भी तृतीय पक्ष के उत्पादों, सेवाओं, सलाह या संचार से उत्पन्न होने वाली किसी भी हानि, क्षति या नुकसान के लिए भी धनम कोई उत्तरदायित्व नहीं लेगी, चाहे ऐसे तृतीय पक्ष को कंपनी से जुड़ा हुआ दर्शाया गया हो या नहीं।'
        },
        {
          heading: 'सामान्य अस्वीकरण',
          body: 'इस वेबसाइट पर उपलब्ध कराई गई जानकारी, सामग्री, सलाह, सुझाव, चित्रण, सूचनाएँ, परिपत्र और अन्य संचार (सामूहिक रूप से, <strong>"सामग्री"</strong>) केवल सामान्य सूचनात्मक उद्देश्यों के लिए प्रकाशित की जाती है। धनम सामग्री में किसी भी त्रुटि या चूक के लिए किसी भी दायित्व से इनकार करती है और सामग्री के आधार पर किसी भी कानूनी दायित्व को स्वीकार नहीं करती है। धनम अपने एकमात्र विवेक पर, पूर्व सूचना के बिना सामग्री के किसी भी भाग को संशोधित, अद्यतन या हटाने का अधिकार सुरक्षित रखती है। धनम इन्वेस्टमेंट एंड फाइनेंस प्राइवेट लिमिटेड की पूर्व लिखित सहमति के बिना, सामग्री के किसी भी भाग को, पूर्ण या आंशिक रूप से, किसी भी रूप या माध्यम में, पुनरुत्पादित, प्रदर्शित, वितरित या मुद्रित नहीं किया जा सकता है।'
        }
      ]
    }
  };

  var LANG_ORDER = ['en', 'ta', 'ml', 'hi'];

  // -----------------------------------------------------------
  // INJECT STYLES
  // -----------------------------------------------------------
  var CSS = [
    '.dhanam-disclaimer-backdrop {',
    '  position: fixed; inset: 0; z-index: 10050;',
    '  background: rgba(0, 0, 0, 0.55);',
    '  display: flex; align-items: center; justify-content: center;',
    '  padding: 24px; opacity: 0; pointer-events: none;',
    '  transition: opacity 0.25s ease;',
    '  backdrop-filter: blur(2px);',
    '}',
    '.dhanam-disclaimer-backdrop.is-open { opacity: 1; pointer-events: auto; }',
    '.dhanam-disclaimer {',
    '  position: relative;',
    '  background: #ffffff;',
    '  width: 100%; max-width: 720px;',
    '  max-height: calc(100vh - 48px);',
    '  border-radius: 14px;',
    '  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);',
    '  overflow: hidden;',
    '  display: flex; flex-direction: column;',
    '  transform: translateY(12px) scale(0.98);',
    '  transition: transform 0.25s ease;',
    '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '}',
    '.dhanam-disclaimer-backdrop.is-open .dhanam-disclaimer { transform: translateY(0) scale(1); }',
    '.dhanam-disclaimer__header {',
    '  display: flex; align-items: center; justify-content: space-between;',
    '  padding: 18px 24px;',
    '  border-bottom: 1px solid var(--gray-200, #E5E7EB);',
    '  background: linear-gradient(135deg, #F5F3EE 0%, #FFFBEF 100%);',
    '  flex-shrink: 0;',
    '}',
    '.dhanam-disclaimer__title {',
    '  margin: 0;',
    '  font-family: "DM Serif Display", Georgia, serif;',
    '  font-size: 1.25rem;',
    '  color: var(--navy, #0F1A2E);',
    '  letter-spacing: 0.2px;',
    '}',
    '.dhanam-disclaimer__close {',
    '  background: transparent; border: none; cursor: pointer;',
    '  width: 34px; height: 34px; border-radius: 50%;',
    '  display: flex; align-items: center; justify-content: center;',
    '  color: var(--gray-600, #555);',
    '  transition: background 0.2s ease, color 0.2s ease;',
    '}',
    '.dhanam-disclaimer__close:hover {',
    '  background: rgba(0, 0, 0, 0.06);',
    '  color: var(--navy, #0F1A2E);',
    '}',
    '.dhanam-disclaimer__close svg { width: 18px; height: 18px; }',
    '.dhanam-disclaimer__lang {',
    '  display: flex; gap: 6px; padding: 12px 24px;',
    '  border-bottom: 1px solid var(--gray-200, #E5E7EB);',
    '  background: #FAFAF7;',
    '  flex-shrink: 0;',
    '}',
    '.dhanam-disclaimer__lang-btn {',
    '  padding: 6px 16px;',
    '  font-size: 0.82rem; font-weight: 600;',
    '  border: 1px solid var(--gray-200, #E5E7EB);',
    '  background: #ffffff;',
    '  color: var(--gray-600, #555);',
    '  border-radius: 999px; cursor: pointer;',
    '  font-family: inherit;',
    '  transition: all 0.2s ease;',
    '}',
    '.dhanam-disclaimer__lang-btn:hover {',
    '  border-color: var(--primary, #B8860B);',
    '  color: var(--navy, #0F1A2E);',
    '}',
    '.dhanam-disclaimer__lang-btn.is-active {',
    '  background: var(--primary, #B8860B);',
    '  border-color: var(--primary, #B8860B);',
    '  color: #ffffff;',
    '}',
    '.dhanam-disclaimer__body {',
    '  padding: 22px 28px 8px;',
    '  overflow-y: auto;',
    '  flex: 1;',
    '  color: var(--gray-600, #444);',
    '  font-size: 0.92rem; line-height: 1.65;',
    '}',
    '.dhanam-disclaimer__body h3 {',
    '  margin: 20px 0 8px;',
    '  font-family: "DM Serif Display", Georgia, serif;',
    '  font-size: 1.02rem;',
    '  color: var(--navy, #0F1A2E);',
    '  letter-spacing: 0.5px;',
    '  text-transform: uppercase;',
    '}',
    '.dhanam-disclaimer__body h3:first-child { margin-top: 0; }',
    '.dhanam-disclaimer__body p {',
    '  margin: 0 0 14px;',
    '  color: var(--gray-600, #444);',
    '}',
    '.dhanam-disclaimer__body strong { color: var(--navy, #0F1A2E); }',
    '.dhanam-disclaimer[data-lang="ta"] .dhanam-disclaimer__body {',
    '  font-family: "Noto Sans Tamil", "Inter", sans-serif;',
    '  font-size: 0.95rem;',
    '}',
    '.dhanam-disclaimer[data-lang="ml"] .dhanam-disclaimer__body {',
    '  font-family: "Noto Sans Malayalam", "Inter", sans-serif;',
    '  font-size: 0.95rem;',
    '}',
    '.dhanam-disclaimer[data-lang="hi"] .dhanam-disclaimer__body {',
    '  font-family: "Noto Sans Devanagari", "Inter", sans-serif;',
    '  font-size: 0.95rem;',
    '}',
    '.dhanam-disclaimer__footer {',
    '  padding: 14px 24px 18px;',
    '  display: flex; justify-content: flex-end;',
    '  border-top: 1px solid var(--gray-200, #E5E7EB);',
    '  background: #FAFAF7;',
    '  flex-shrink: 0;',
    '}',
    '.dhanam-disclaimer__ok {',
    '  padding: 10px 28px;',
    '  font-size: 0.88rem; font-weight: 600;',
    '  font-family: inherit;',
    '  background: var(--primary, #B8860B);',
    '  color: #ffffff;',
    '  border: none; border-radius: 8px; cursor: pointer;',
    '  transition: background 0.2s ease, transform 0.1s ease;',
    '}',
    '.dhanam-disclaimer__ok:hover { background: #A0760A; }',
    '.dhanam-disclaimer__ok:active { transform: translateY(1px); }',
    '@media (max-width: 600px) {',
    '  .dhanam-disclaimer-backdrop { padding: 12px; }',
    '  .dhanam-disclaimer__header { padding: 14px 18px; }',
    '  .dhanam-disclaimer__title { font-size: 1.1rem; }',
    '  .dhanam-disclaimer__lang { padding: 10px 18px; }',
    '  .dhanam-disclaimer__body { padding: 18px 20px 6px; font-size: 0.88rem; }',
    '  .dhanam-disclaimer__body h3 { font-size: 0.95rem; }',
    '  .dhanam-disclaimer__footer { padding: 12px 18px 14px; }',
    '}',
    'body.dhanam-disclaimer-open { overflow: hidden; }'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('dhanam-disclaimer-styles')) return;
    var style = document.createElement('style');
    style.id = 'dhanam-disclaimer-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // -----------------------------------------------------------
  // BUILD + RENDER
  // -----------------------------------------------------------
  var backdropEl = null;
  var dialogEl = null;
  var bodyEl = null;
  var titleEl = null;
  var okBtnEl = null;
  var closeBtnEl = null;
  var currentLang = 'en';

  function buildDOM() {
    // Titles per language
    var titles = { en: 'Important Information', ta: 'முக்கிய தகவல்', ml: 'പ്രധാന വിവരം', hi: 'महत्वपूर्ण सूचना' };

    backdropEl = document.createElement('div');
    backdropEl.className = 'dhanam-disclaimer-backdrop';
    backdropEl.setAttribute('role', 'presentation');

    dialogEl = document.createElement('div');
    dialogEl.className = 'dhanam-disclaimer';
    dialogEl.setAttribute('role', 'dialog');
    dialogEl.setAttribute('aria-modal', 'true');
    dialogEl.setAttribute('aria-labelledby', 'dhanam-disclaimer-title');
    dialogEl.setAttribute('data-lang', 'en');

    // Header
    var header = document.createElement('div');
    header.className = 'dhanam-disclaimer__header';

    titleEl = document.createElement('h2');
    titleEl.className = 'dhanam-disclaimer__title';
    titleEl.id = 'dhanam-disclaimer-title';
    titleEl.textContent = titles.en;
    titleEl.dataset.titles = JSON.stringify(titles);

    closeBtnEl = document.createElement('button');
    closeBtnEl.className = 'dhanam-disclaimer__close';
    closeBtnEl.type = 'button';
    closeBtnEl.setAttribute('aria-label', 'Close');
    closeBtnEl.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

    header.appendChild(titleEl);
    header.appendChild(closeBtnEl);

    // Language switch
    var langBar = document.createElement('div');
    langBar.className = 'dhanam-disclaimer__lang';
    langBar.setAttribute('role', 'tablist');
    LANG_ORDER.forEach(function (code) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dhanam-disclaimer__lang-btn' + (code === 'en' ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', code === 'en' ? 'true' : 'false');
      btn.setAttribute('data-lang-code', code);
      btn.textContent = CONTENT[code].langLabel;
      btn.addEventListener('click', function () { setLanguage(code); });
      langBar.appendChild(btn);
    });

    // Body
    bodyEl = document.createElement('div');
    bodyEl.className = 'dhanam-disclaimer__body';

    // Footer
    var footer = document.createElement('div');
    footer.className = 'dhanam-disclaimer__footer';
    okBtnEl = document.createElement('button');
    okBtnEl.className = 'dhanam-disclaimer__ok';
    okBtnEl.type = 'button';
    okBtnEl.textContent = CONTENT.en.understood;
    footer.appendChild(okBtnEl);

    // Assemble
    dialogEl.appendChild(header);
    dialogEl.appendChild(langBar);
    dialogEl.appendChild(bodyEl);
    dialogEl.appendChild(footer);
    backdropEl.appendChild(dialogEl);
    document.body.appendChild(backdropEl);

    // Render initial language
    renderBody('en');

    // Wire up close actions
    closeBtnEl.addEventListener('click', close);
    okBtnEl.addEventListener('click', close);
    backdropEl.addEventListener('click', function (e) {
      if (e.target === backdropEl) close();
    });
  }

  function renderBody(lang) {
    var data = CONTENT[lang] || CONTENT.en;
    var html = '';
    data.sections.forEach(function (s) {
      html += '<h3>' + s.heading + '</h3><p>' + s.body + '</p>';
    });
    bodyEl.innerHTML = html;
    okBtnEl.textContent = data.understood;
    closeBtnEl.setAttribute('aria-label', data.closeLabel);

    // Update title
    try {
      var titles = JSON.parse(titleEl.dataset.titles);
      titleEl.textContent = titles[lang] || titles.en;
    } catch (_) { /* ignore */ }
  }

  function setLanguage(lang) {
    if (!CONTENT[lang]) return;
    currentLang = lang;
    dialogEl.setAttribute('data-lang', lang);
    // Toggle active state on buttons
    var btns = dialogEl.querySelectorAll('.dhanam-disclaimer__lang-btn');
    btns.forEach(function (b) {
      var on = b.getAttribute('data-lang-code') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderBody(lang);
  }

  // -----------------------------------------------------------
  // OPEN / CLOSE + A11Y
  // -----------------------------------------------------------
  var previouslyFocused = null;
  var keydownHandler = null;

  function open() {
    if (!backdropEl) buildDOM();
    previouslyFocused = document.activeElement;
    document.body.classList.add('dhanam-disclaimer-open');
    // Force reflow so the transition plays
    // eslint-disable-next-line no-unused-expressions
    backdropEl.offsetHeight;
    backdropEl.classList.add('is-open');

    // Focus the close button for keyboard users
    setTimeout(function () { closeBtnEl.focus(); }, 60);

    // ESC to close + focus trap
    keydownHandler = function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        var focusables = dialogEl.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', keydownHandler);
  }

  // sessionStorage flag — persists for the life of the browser tab/window
  // so the modal only fires on the first page launched, not on internal nav.
  var STORAGE_KEY = 'dhanamDisclaimerAcknowledged';

  function markAcknowledged() {
    try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) { /* storage may be unavailable */ }
  }

  function hasAcknowledged() {
    try { return window.sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (_) { return false; }
  }

  function close() {
    if (!backdropEl) return;
    markAcknowledged();
    backdropEl.classList.remove('is-open');
    document.body.classList.remove('dhanam-disclaimer-open');
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      try { previouslyFocused.focus(); } catch (_) { /* noop */ }
    }
  }

  // -----------------------------------------------------------
  // BOOTSTRAP
  // -----------------------------------------------------------
  function boot() {
    injectStyles();
    // If the user already saw the disclaimer this browser session,
    // don't auto-open on internal navigation. The modal can still be
    // triggered manually via window.DhanamDisclaimer.open() if needed.
    if (hasAcknowledged()) return;
    buildDOM();
    // Small delay so the page has a moment to paint before the modal
    setTimeout(open, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Expose for debugging / manual trigger (e.g. from a footer link later)
  window.DhanamDisclaimer = {
    open: open,
    close: close,
    setLanguage: setLanguage
  };
})();
