package backend.backend.notification.service.fcm;

import backend.backend.common.event.CommentCreateEvent;
import backend.backend.common.event.ReservationReminderEvent;
import backend.backend.notification.domain.FcmNotification;
import backend.backend.notification.repository.FcmNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {
    private final FcmNotificationRepository fcmNotificationRepository;
    private final FcmService fcmService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @EventListener
    @Async //***
    public void sendCreateCommentNotification(CommentCreateEvent commentCreateEvent) {
        FcmNotification fcmNotification = FcmNotification.builder()
                .fcmNotificationCategory(commentCreateEvent.fcmNotificationCategory())
                .content(commentCreateEvent.senderName() + "님이 댓글을 작성했습니다: " + commentCreateEvent.content())
                .targetId(commentCreateEvent.targetId())
                .receiverId(commentCreateEvent.receiverId())
                .isRead(false)
                .build();

        fcmNotificationRepository.save(fcmNotification);
        fcmService.sendMessage(fcmNotification);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @EventListener
    @Async
    public void sendReservationReminderNotification(ReservationReminderEvent reservationReminderEvent) {
        FcmNotification fcmNotification = FcmNotification.builder()
                .fcmNotificationCategory(reservationReminderEvent.fcmNotificationCategory())
                .content(reservationReminderEvent.receiverName() + "님 입장 10분 전 입니다!")
                .targetId(reservationReminderEvent.targetId())
                .receiverId(reservationReminderEvent.receiverId())
                .isRead(false)
                .build();

        fcmNotificationRepository.save(fcmNotification);
        fcmService.sendMessage(fcmNotification);
    }
}
