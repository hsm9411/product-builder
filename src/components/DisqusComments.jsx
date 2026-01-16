import React, { useEffect } from 'react';

const DisqusComments = () => {
    const url = window.location.href;

    useEffect(() => {
        // Set the config for initial load or for reset
        window.disqus_config = function () {
            this.page.url = url;
            this.page.identifier = url;
        };

        // Check if the Disqus script is already on the page
        if (!document.querySelector('script[src*="disqus.com/embed.js"]')) {
            const d = document;
            const s = d.createElement('script');
            s.src = 'https://productbuilder-5.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        } else {
            // If the script is already there, tell Disqus to reset with the new config
            if (window.DISQUS) {
                window.DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.url = url;
                        this.page.identifier = url;
                    }
                });
            }
        }
    }, [url]); // Rerun this effect if the url changes

    return (
        <section className="tool-section">
            <h2 className="title">댓글</h2>
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
        </section>
    );
};

export default DisqusComments;
