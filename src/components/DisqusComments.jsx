import React, { useEffect } from 'react';

const DisqusComments = () => {
    useEffect(() => {
        const disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = window.location.href;
        };

        // Don't re-add the script if it already exists
        if (!document.querySelector('script[src*="disqus.com/embed.js"]')) {
            const d = document;
            const s = d.createElement('script');
            s.src = 'https://productbuilder-5.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    }, []);

    return (
        <section className="tool-section">
            <h2 className="title">댓글</h2>
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
        </section>
    );
};

export default DisqusComments;
